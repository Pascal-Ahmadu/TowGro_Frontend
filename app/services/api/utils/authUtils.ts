/**
 * @file authUtils.ts
 * @description Authentication utilities for token management
 */

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../config/constants';

/**
 * Authentication token response from the server
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  token?: string;
  [key: string]: unknown;
}

/**
 * Get the current auth token from secure storage
 * @returns Promise resolving to token string or null
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    const expirationStr = await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN_EXPIRATION);
    
    if (!token || !expirationStr) {
      return null;
    }
    
    const expiration = parseInt(expirationStr, 10);
    
    // If token isn't expired, return it
    if (Date.now() < expiration) {
      return token;
    }
    
    // Token is expired, return null
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Extract token from response with enhanced logging
 * @param response - API response object
 * @returns The extracted token or null if not found
 */
export function extractTokenFromResponse(response: any): string | null {
  // Check all possible token locations
  const possibleTokens = {
    accessToken: response.data?.accessToken,
    token: response.data?.token,
    xAuthToken: response.headers?.['x-auth-token'],
    authorization: response.headers?.authorization,
    bearerHeader: response.headers?.authorization?.startsWith('Bearer ') ? 
      response.headers.authorization.substring(7) : null,
    authToken: response.data?.authToken
  };
  
  // Log token search results in development
  if (__DEV__) {
    console.log('Token extraction search results:', 
      Object.fromEntries(
        Object.entries(possibleTokens)
          .map(([key, value]) => [key, value ? 'FOUND' : 'NOT FOUND'])
      )
    );
  }
  
  // Check for token in response body first
  const token = possibleTokens.accessToken || 
                possibleTokens.token || 
                possibleTokens.xAuthToken || 
                possibleTokens.bearerHeader ||
                possibleTokens.authToken;
  
  if (token) {
    return token;
  }
  
  // If no token found but we have a successful response, 
  // check if it's using cookie-based authentication
  if (response.status >= 200 && response.status < 300) {
    // Check if there are any Set-Cookie headers
    const hasCookies = Object.keys(response.headers || {}).some(h => 
      h.toLowerCase() === 'set-cookie' || 
      h.toLowerCase().includes('cookie'));
    
    if (hasCookies) {
      // Use a placeholder token for cookie-based authentication
      if (__DEV__) {
        console.log('Using cookie-based authentication');
      }
      return 'cookie-based-auth';
    }
    
    // For status 201 (Created) responses, we might assume success even without explicit tokens
    // Some APIs implicitly establish a session on successful login
    if (response.status === 201) {
      if (__DEV__) {
        console.log('Successful login with status 201, assuming implicit session');
      }
      return 'implicit-session-auth';
    }
  }
  
  return null;
}

/**
 * Refresh the access token using the refresh token
 * @param baseURL - Base URL for API
 * @returns Promise resolving to new token or null
 */
export async function refreshAccessToken(baseURL: string): Promise<string | null> {
  try {
    const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!refreshToken) {
      return null;
    }
    
    // Use axios directly to avoid interceptors
    const response = await axios.post<TokenResponse>(
      `${baseURL}${API_ENDPOINTS.TOKEN_REFRESH}`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.data) {
      throw new Error('Empty response from refresh token endpoint');
    }
    
    // Use enhanced token extraction
    const newToken = extractTokenFromResponse(response);
    if (!newToken) {
      throw new Error('No token found in refresh response');
    }
    
    // Store new tokens (with accessToken fallback for compatibility)
    await storeAuthTokens({
      accessToken: newToken,
      refreshToken: response.data.refreshToken || refreshToken,
      expiresIn: response.data.expiresIn || 3600
    });
    
    return newToken;
  } catch (error) {
    // Clear tokens on refresh failure
    await clearAuthTokens();
    throw error;
  }
}

/**
 * Store authentication tokens securely
 * @param data - Token response data
 */
export async function storeAuthTokens(data: TokenResponse): Promise<void> {
  const tokenExpiration = Date.now() + (data.expiresIn * 1000);
  
  await Promise.all([
    SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, data.accessToken),
    SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken),
    SecureStore.setItemAsync(STORAGE_KEYS.TOKEN_EXPIRATION, tokenExpiration.toString())
  ]);
}

/**
 * Clear authentication tokens
 */
export async function clearAuthTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN),
    SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
    SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN_EXPIRATION)
  ]);
}

/**
 * Checks if an error is a token expired error
 * @param error - Error to check
 * @returns Boolean indicating if error is from expired token
 */
export function isTokenExpiredError(error: any): boolean {
  return error.response?.status === 401 &&
    (error.response?.data?.code === 'TOKEN_EXPIRED' || 
     error.response?.data?.message?.includes('expired'));
}