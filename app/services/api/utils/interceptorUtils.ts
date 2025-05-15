/**
 * @file interceptorUtils.ts
 * @description Axios interceptor utilities for request/response handling
 */

import { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store'; // Add this import
import { API_ENDPOINTS, STORAGE_KEYS } from '../../config/constants'; // Add STORAGE_KEYS
import { getAuthToken } from './authUtils';
import { formatError, handleAuthError, isAuthEndpoint } from './errorUtils';

// Import Redux action
import { logoutSuccess } from '../../../store/authSlice'; // Add this import

/**
 * Queue type for storing failed requests awaiting token refresh
 */
interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}

// Queue for storing requests that failed due to token expiration
let failedRequestsQueue: Array<QueueItem> = [];
let isRefreshing = false;

/**
 * Process the queue of failed requests after token refresh
 * @param error - Error to reject with if token refresh failed
 * @param token - New token if refresh succeeded
 * @param axiosInstance - Axios instance to use for retried requests
 */
function processQueue(error: any, token: string | null, axiosInstance: AxiosInstance): void {
  failedRequestsQueue.forEach(request => {
    if (error) {
      request.reject(error);
    } else if (token) {
      // Ensure headers object exists before setting Authorization
      if (!request.config.headers) {
        request.config.headers = {};
      }
      request.config.headers.Authorization = `Bearer ${token}`;
      request.resolve(axiosInstance(request.config));
    }
  });
  
  // Clear the queue
  failedRequestsQueue = [];
}

/**
 * Setup request interceptor
 * @param axiosInstance - Axios instance to add interceptor to
 */
export function setupRequestInterceptor(axiosInstance: AxiosInstance): void {
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Get auth endpoints once for comparison
      const authEndpoints = [
        API_ENDPOINTS.LOGIN,
        API_ENDPOINTS.REGISTER,
        API_ENDPOINTS.FORGOT_PASSWORD,
        API_ENDPOINTS.TOKEN_REFRESH,
        API_ENDPOINTS.VERIFY_EMAIL,
        API_ENDPOINTS.RESET_PASSWORD
      ];
      
      // Enable withCredentials for all requests to allow cookies to be sent
      config.withCredentials = true;
      
      // Only add token for non-auth requests if we're using token-based auth
      if (!isAuthEndpoint(config.url, authEndpoints)) {
        const token = await getAuthToken();
        if (token && token !== 'session-based-auth') {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Log request in development
      if (__DEV__) {
        console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`, 
          config.params || config.data || '');
      }

      return config;
    },
    (error) => {
      if (__DEV__) {
        console.error('❌ Request Error:', error);
      }
      return Promise.reject(error);
    }
  );
}

/**
 * Setup response interceptor
 * @param axiosInstance - Axios instance to add interceptor to
 * @param baseURL - Base URL for API
 */
export function setupResponseInterceptor(axiosInstance: AxiosInstance, baseURL: string, store?: any): void {
  // In setupResponseInterceptor function
  axiosInstance.interceptors.response.use(
    response => {
      // Check for and log any Set-Cookie headers in development
      if (__DEV__ && response.headers) {
        const cookieHeaders = Object.keys(response.headers).filter(header => 
          header.toLowerCase() === 'set-cookie' || 
          header.toLowerCase().includes('cookie'));
          
        if (cookieHeaders.length > 0) {
          console.log('🍪 Received cookies in response:', cookieHeaders);
        }
      }
      
      return response;
    },
    async (error) => {
      // Handle 401 Unauthorized errors (expired token)
      if (error.response?.status === 401) {
        // If store is provided, dispatch logout action
        if (store) {
          store.dispatch(logoutSuccess());
          // Clear cookies if using session-based auth
          await SecureStore.deleteItemAsync(STORAGE_KEYS.SESSION_COOKIE);
        } else {
          // Handle without store if not provided
          handleAuthError();
        }
      }
      
      // Format the error to ensure consistent structure
      const formattedError = formatError(error);
      return Promise.reject(formattedError);
    }
  );
}

// Remove the second implementation of setupResponseInterceptor (lines 229-241)