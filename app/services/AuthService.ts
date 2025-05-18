/**
 * @file AuthService.ts (Updated)
 * @description Enhanced authentication service with improved error handling
 */
import * as SecureStore from 'expo-secure-store';
import { store } from '../store';
import { logoutSuccess } from '../store/authSlice';
import apiClient, { ApiResponse } from './api/ApiClient';
import { extractTokenFromResponse, storeAuthTokens } from './api/utils/authUtils';
import { formatError } from './api/utils/errorUtils';
import { API_ENDPOINTS, STORAGE_KEYS } from './config/constants';

// Types
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface BiometricLoginRequest {
  identifier: string;
  password?: string; // Optional for biometric auth
}

export interface RegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

// Add this function to properly type-check Axios errors
function isAxiosError(error: unknown): error is { response?: { data?: any } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}

/**
 * Auth Service with improved error handling and response validation
 */
class AuthService {
  /**
   * Login with email/username/phone and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<any>> {
    console.log(`Login attempt:`, { identifier: credentials.identifier });
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
      
      // Modified line - access data property for ApiResponse structure
      if (!response.data.success && response.data.error) {
        return {
          success: false,
          error: response.data.error,
          status: response.status
        };
      }
      
      // Log response details for debugging
      console.log('Login response received:', {
        dataKeys: Object.keys(response.data || {}),
        headerKeys: Object.keys(response.headers || {}),
        status: response.status
      });
      
      // Important: Check for "No user found" in the response headers
      // This is critical because our server logs show this message
      const responseHeaders = JSON.stringify(response.headers || {}).toLowerCase();
      const responseData = JSON.stringify(response.data || {}).toLowerCase();
      
      // Check for no user found indicators in headers or data
      if (responseHeaders.includes('no user found') || responseData.includes('no user found')) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'No account found with this email. Please check your credentials or create an account.'
          },
          status: response.status
        };
      }
  
      // Check for successful login (status 201 or 200)
      if (response.status >= 200 && response.status < 300) {
        const token = extractTokenFromResponse(response);
        
        if (token) {
          // Store token or session info
          await storeAuthTokens({
            accessToken: token,
            refreshToken: response.data?.refreshToken || 'session-auth',
            expiresIn: response.data?.expiresIn || 86400
          });
          
          return {
            success: true,
            data: response.data,
            status: response.status
          };
        } else {
          // No token found, likely a server configuration issue
          console.warn('No authentication token found in successful response');
          return {
            success: false,
            error: {
              code: 'AUTH_TOKEN_MISSING',
              message: 'Authentication failed. Please check your email and password.'
            },
            status: response.status
          };
        }
      }
      
      // Handle specific error responses from API
      // Default error response
      return {
        success: false,
        error: {
          code: response.data?.code || 'AUTH_ERROR',
          message: response.data?.message || 'Authentication failed'
        },
        status: response.status
      };
    } catch (error) {
      // Enhanced error handling with detailed logging
      console.error('Login error:', error);
      
      const formattedError = formatError(error);
      
      // Check for specific error messages in the error response
      let errorResponse: any = null;
      let errorText = '';
      
      if (isAxiosError(error)) {
        errorResponse = error.response?.data;
        // Convert the entire error response to string for pattern matching
        errorText = JSON.stringify(error.response || {}).toLowerCase();
      }
      
      // Check if the error contains debug logs indicating no user found
      // This is critical because our server logs show this pattern
      if (errorText.includes('no user found') || 
          errorText.includes('[authservice] no user found') ||
          errorText.includes('[usersservice] searching user')) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'No account found with this email. Please check your credentials or create an account.'
          }
        };
      }
      
      // Check for invalid credentials pattern
      if (errorText.includes('invalid password') || errorText.includes('incorrect password')) {
        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid password. Please check your credentials and try again.'
          }
        };
      }
      
      // Network or server errors
      if (formattedError.message?.includes('network') || !errorResponse) {
        return {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: 'Network connection error. Please check your internet connection.'
          }
        };
      }
      
      return {
        success: false,
        error: formattedError.error || {
          code: errorResponse?.code || 'AUTH_ERROR',
          message: errorResponse?.message || formattedError.message || 'Authentication failed'
        }
      };
    }
  }

  /**
   * Login with biometric authentication
   */
  async loginWithBiometricFallback(credentials: BiometricLoginRequest): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.BIOMETRIC_AUTH, 
        { identifier: credentials.identifier }
      );
      
      if (response.status >= 200 && response.status < 300) {
        const token = extractTokenFromResponse(response);
        
        if (token) {
          await storeAuthTokens({
            accessToken: token,
            refreshToken: response.data?.refreshToken || 'session-auth',
            expiresIn: response.data?.expiresIn || 86400
          });
          
          return {
            success: true,
            data: response.data,
            status: response.status
          };
        }
      }
      
      return {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Biometric authentication failed'
        },
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: formatError(error).error || {
          code: 'AUTH_ERROR',
          message: 'Biometric authentication failed'
        }
      };
    }
  }

  /**
   * Login with Google
   */
  async loginWithGoogle(accessToken: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.GOOGLE_AUTH, { accessToken });
      
      if (response.status >= 200 && response.status < 300) {
        const token = extractTokenFromResponse(response);
        
        if (token) {
          await storeAuthTokens({
            accessToken: token,
            refreshToken: response.data?.refreshToken || 'session-auth',
            expiresIn: response.data?.expiresIn || 86400
          });
          
          return {
            success: true,
            data: response.data,
            status: response.status
          };
        }
      }
      
      return {
        success: false,
        error: {
          code: 'GOOGLE_AUTH',
          message: 'Google authentication failed'
        },
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: formatError(error).error || {
          code: 'GOOGLE_AUTH',
          message: 'Google authentication failed'
        }
      };
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegistrationRequest): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
      
      if (response.status >= 200 && response.status < 300) {
        const token = extractTokenFromResponse(response);
        
        if (token) {
          await storeAuthTokens({
            accessToken: token,
            refreshToken: response.data?.refreshToken || 'session-auth',
            expiresIn: response.data?.expiresIn || 86400
          });
          
          return {
            success: true,
            data: response.data,
            status: response.status
          };
        }
      }
      
      return {
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: 'Registration failed'
        },
        status: response.status
      };
    } catch (error) {
      // Check for common registration errors
      const errorStr = JSON.stringify(error).toLowerCase();
      
      if (errorStr.includes('email already exists') || errorStr.includes('duplicate')) {
        return {
          success: false,
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            message: 'An account with this email already exists. Please try logging in instead.'
          }
        };
      }
      
      return {
        success: false,
        error: formatError(error).error || {
          code: 'REGISTRATION_ERROR',
          message: 'Registration failed'
        }
      };
    }
  }

  /**
   * Forgot password request
   */
  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
      
      return {
        success: response.status >= 200 && response.status < 300,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      const errorStr = JSON.stringify(error).toLowerCase();
      
      if (errorStr.includes('no user found') || errorStr.includes('user not found')) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'No account found with this email. Please check your email or create an account.'
          }
        };
      }
      
      return {
        success: false,
        error: formatError(error).error || {
          code: 'FORGOT_PASSWORD_ERROR',
          message: 'Failed to process forgot password request'
        }
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, {
        token,
        newPassword
      });
      
      return {
        success: response.status >= 200 && response.status < 300,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      const errorStr = JSON.stringify(error).toLowerCase();
      
      if (errorStr.includes('token expired') || errorStr.includes('invalid token')) {
        return {
          success: false,
          error: {
            code: 'RESET_TOKEN_INVALID',
            message: 'This password reset link has expired or is invalid. Please request a new one.'
          }
        };
      }
      
      return {
        success: false,
        error: formatError(error).error || {
          code: 'RESET_PASSWORD_ERROR',
          message: 'Failed to reset password'
        }
      };
    }
  }

  /**
   * Verify token
   */
  async verifyToken(token: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.TOKEN_REFRESH, { token });
      
      return {
        success: response.status >= 200 && response.status < 300,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: formatError(error).error || {
          code: 'TOKEN_VERIFICATION_ERROR',
          message: 'Token verification failed'
        }
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<any> | void> {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout failed:', error);
      return Promise.reject(error);
    } finally {
      // Clear all authentication artifacts
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      store.dispatch(logoutSuccess());

    }
  }

  /**
   * Validate user session
   */
  async validateSession(): Promise<ApiResponse<{isAuthenticated: boolean}>> {
    try {
      const hasSession = await SecureStore.getItemAsync(
        STORAGE_KEYS.SESSION_COOKIE
      );
      
      if (hasSession === 'session-established') {
        return { success: true, data: { isAuthenticated: true } };
      }
      // Use any protected endpoint that returns 200 when authenticated
      await apiClient.get(API_ENDPOINTS.USER_PROFILE);
      return { success: true, data: { isAuthenticated: true } };
    } catch (error) {
      return {
        success: false,
        error: formatError(error),
        data: { isAuthenticated: false }
      };
    }
  }
}

export default new AuthService();