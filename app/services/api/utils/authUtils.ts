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
  // Add debug logging
  console.log('Token search locations:', {
    data: response.data,
    headers: response.headers
  });

  // Check response body first
  const token = response.data?.accessToken || 
               response.data?.token ||
               response.headers?.['x-auth-token'] ||
               response.headers?.authorization?.replace('Bearer ', '');

  if (!token) {
    console.warn('Token not found in:', {
      dataKeys: Object.keys(response.data || {}),
      headerKeys: Object.keys(response.headers || {})
    });
  }
  return token;
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
export async function storeAuthTokens(tokens: {
  accessToken: string,
  refreshToken: string,
  expiresIn: number
}): Promise<void> {
  // Add session validation
  if (tokens.accessToken === 'implicit-session-auth') {
    console.log('Session-based authentication established');
    await SecureStore.setItemAsync(
      STORAGE_KEYS.SESSION_COOKIE, 
      'session-established'
    );
    return;
  }
  const tokenExpiration = Date.now() + (tokens.expiresIn * 1000);
  
  await Promise.all([
    SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken),
    SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
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