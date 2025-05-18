/**
 * @file ApiClient.ts
 * @description Advanced API client using Axios with authentication, interceptors,
 * and proper error handling. Designed for React Native applications.
 *
 * This client handles authentication tokens, request/response interceptors,
 * and provides a consistent error handling pattern.
 *
 * @author Pascal Ally Ahmadu <pascalally41@gmail.com>
 * @lastModified May 16, 2025
 */

import type { InternalAxiosRequestConfig } from 'axios';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource
} from 'axios';
import { Platform } from 'react-native';
import { clearAuthTokens } from './utils/authUtils';
import { setupRequestInterceptor, setupResponseInterceptor } from './utils/interceptorUtils';

/* --------------------------------- Types ---------------------------------- */

/**
 * Standard API response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: 'USER_NOT_FOUND' | 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' | 
          'NETWORK_UNAVAILABLE' | 'MISSING_TOKEN' | 'NETWORK_ERROR' | 
          'CORS_ERROR' | 'TOO_MANY_REQUESTS' | 'AUTH_ERROR' | 'NO_DATA' | 
          'VERIFICATION_ERROR' | 'UNKNOWN_ERROR' | string;
    message: string;
    isNetworkError?: boolean;
  };
  status?: number;
}

// Re-export utility types
export { TokenResponse } from './utils/authUtils';
export { ApiError } from './utils/errorUtils';

/**
 * Configuration for ApiClient singleton
 */
interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/* ------------------------------- Constants ------------------------------- */

// Base API URL (allow for environment-specific override)
const API_BASE_URL = process.env.API_BASE_URL || 'https://tow-gro.onrender.com';

// Default request timeout in milliseconds
const DEFAULT_TIMEOUT = 30000;

// Default headers for all requests
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Platform: Platform.OS
};

/* ------------------------------- ApiClient Class -------------------------- */

/**
 * ApiClient singleton for handling API requests
 */
class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  // In the constructor of ApiClient class
  private constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      headers: { ...DEFAULT_HEADERS, ...config.headers },
      withCredentials: true, // Enable cookies for all requests
      maxRedirects: 0,
      transitional: {
        silentJSONParsing: false,
        forcedJSONParsing: false
      }
    });

    // In development, override adapter to inspect raw XHR behavior
    // This implementation is incomplete and causing requests to hang.
    // Commenting out to use the default Axios adapter.
    /*
    if (__DEV__) {
      this.axiosInstance.defaults.adapter = (cfg: InternalAxiosRequestConfig) => {
        return new Promise<AxiosResponse>((resolve, reject) => {
          const req = new XMLHttpRequest();
          const method = (cfg.method || 'get').toUpperCase();
          const url = `${cfg.baseURL || ''}${cfg.url || ''}`; // Safe URL construction
          req.open(method, url);

          // Additional XMLHttpRequest implementation would go here
          // This is currently incomplete and needs implementation
        });
      };
    }
    */

    // Attach interceptors
    setupRequestInterceptor(this.axiosInstance);
    setupResponseInterceptor(this.axiosInstance, this.baseURL);
  }

  /**
   * Retrieve singleton instance
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient({ baseURL: API_BASE_URL });
    }
    return ApiClient.instance;
  }

  /**
   * Manually set Authorization header on the Axios instance
   */
  public setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear the Authorization header and local tokens
   */
  public clearAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
    clearAuthTokens();
  }

  /**
   * Perform a GET request
   */
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  /**
   * Perform a POST request
   */
  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  /**
   * Perform a PUT request
   */
  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  /**
   * Perform a PATCH request
   */
  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  /**
   * Perform a DELETE request
   */
  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  /**
   * Create a cancel token for aborting requests
   */
  public createCancelToken(): CancelTokenSource {
    return axios.CancelToken.source();
  }

  /**
   * Check if an error was due to a cancelled request
   */
  public isCancel(error: any): boolean {
    return axios.isCancel(error);
  }

  /**
   * Generic request wrapper (logging example)
   */
  public async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // Optional: attach metadata
    this.axiosInstance.interceptors.request.use(cfg => {
      console.log(
        '[NETWORK] Request:',
        (cfg.method ?? 'GET').toUpperCase(),
        `${cfg.baseURL ?? 'NO_BASE_URL'}${cfg.url ?? 'NO_URL'}`
      );
      
      return cfg;
    });
    return this.axiosInstance.request<T>(config);
  }
}

// Export singleton
const apiClientInstance = ApiClient.getInstance();
export const setAuthToken = (token: string) => apiClientInstance.setAuthToken(token);
export const clearAuthToken = () => apiClientInstance.clearAuthToken();
export const createCancelToken = () => apiClientInstance.createCancelToken();
export const isCancel = (error: any) => apiClientInstance.isCancel(error);
export default apiClientInstance;

// Extend Axios types to carry metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: { startTime?: number };
  }
}