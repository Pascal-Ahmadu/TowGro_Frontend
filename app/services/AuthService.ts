/**
 * @file AuthService.ts (Updated)
 * @description Fixed authentication service for handling user login/registration
 */
import apiClient, { ApiResponse } from './api/ApiClient';
import { extractTokenFromResponse, storeAuthTokens } from './api/utils/authUtils';
import { formatError } from './api/utils/errorUtils';
import { API_ENDPOINTS } from './config/constants';

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
      
      // Log response details for debugging
      console.log('Login response received:', {
        dataKeys: Object.keys(response.data || {}),
        headerKeys: Object.keys(response.headers || {}),
        status: response.status
      });

      // FIXED: Check the actual server log for user not found
      // We need to check both the response status and if there's an error in the debug logs
      if (response.status === 201) {
        // Check for token extraction
        const token = extractTokenFromResponse(response);
        
        if (!token) {
          // FIX: Check for user not found in server logs
          if (response.headers?.['x-debug-message']?.includes('No user found') ||
              !response.data?.success) {
            return {
              success: false,
              error: {
                code: 'USER_NOT_FOUND',
                message: 'No account found with this email. Please check your credentials or create an account.'
              },
              status: response.status
            };
          }
        }
        
        // If token is found or session-based auth is used, store tokens
        if (token) {
          // Store token or session info
          await storeAuthTokens({
            accessToken: token,
            refreshToken: response.data?.refreshToken || 'session-auth',
            expiresIn: response.data?.expiresIn || 86400
          });
        }
        
        return {
          success: true,
          data: response.data,
          status: response.status
        };
      }
      
      return {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Authentication failed'
        },
        status: response.status
      };
    } catch (error) {
      // Enhanced error handling with detailed logging
      console.error('Login error:', error);
      
      // Check for network connectivity issues
      const formattedError = formatError(error);
      
      // Add specific error handling for user_not_found
      if (formattedError.message?.includes('No user found') ||
          formattedError.code === 'USER_NOT_FOUND') {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'No account found with this email. Please check your credentials or create an account.'
          }
        };
      }
      
      return {
        success: false,
        error: formattedError.error || {
          code: 'AUTH_ERROR',
          message: formattedError.message || 'Authentication failed'
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
  async logout(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGOUT);
      
      // Clear auth token from client
      apiClient.clearAuthToken();
      
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      // Still clear token even if logout API fails
      apiClient.clearAuthToken();
      
      return {
        success: false,
        error: formatError(error).error || {
          code: 'LOGOUT_ERROR',
          message: 'Logout failed'
        }
      };
    }
  }

  /**
   * Validate user session
   */
  async validateSession(): Promise<ApiResponse<{isAuthenticated: boolean}>> {
    try {
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