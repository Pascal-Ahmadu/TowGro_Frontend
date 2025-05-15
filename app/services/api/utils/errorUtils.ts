/**
 * @file errorUtils.ts
 * @description Utilities for error handling and formatting
 */

/**
 * Standard error object structure
 */
export interface ApiError {
      code: "USER_NOT_FOUND" | "INVALID_CREDENTIALS" | "ACCOUNT_LOCKED" | 
        "NETWORK_UNAVAILABLE" | "MISSING_TOKEN" | "NETWORK_ERROR" | 
        "CORS_ERROR" | "TOO_MANY_REQUESTS" | "AUTH_ERROR" | "NO_DATA" |
        "VERIFICATION_ERROR" | "GOOGLE_AUTH_FAILED" | "INVALID_TOKEN" | "TOKEN_EXPIRED" | string;
  message: string;
  isNetworkError?: boolean;
  // Add error property if needed
  error?: {
    code: string;
    message: string;
  };
  details?: any;
}
   
  
  /**
   * Format API error for consistent handling
   * @param error - Error from axios
   * @returns Formatted API error
   */
  export function formatError(error: any): ApiError {
    const apiError: ApiError = {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred'
    };
  
    if (error.response) {
      // Server responded with an error status
      apiError.code = `SERVER_ERROR_${error.response.status}`;
      apiError.message = error.response.data?.message || `Error ${error.response.status}`;
      apiError.details = error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      apiError.code = 'NETWORK_ERROR';
      apiError.message = 'No response received from server';
      apiError.details = error.request;
    } else {
      // Something happened in setting up the request
      apiError.code = 'REQUEST_SETUP_ERROR';
      apiError.message = error.message || 'Error setting up request';
    }
  
    return apiError;
  }
  
  /**
   * Handle authentication error (401) after token refresh failed
   * Can be extended to navigate to login screen
   */
  export function handleAuthError(): void {
    // You can add navigation logic here to redirect to login
    // For example:
    // import { NavigationService } from '../navigation';
    // NavigationService.navigate('Login');
    
    // This function is a placeholder for auth error handling
    // actual token clearing is done in authUtils.ts
  }
  
  /**
   * Check if the given endpoint is an auth endpoint (doesn't need token)
   * @param url - Request URL
   * @param authEndpoints - List of auth endpoints
   * @returns Boolean indicating if this is an auth endpoint
   */
  export function isAuthEndpoint(url: string | undefined, authEndpoints: string[]): boolean {
    if (!url) return false;
    
    return authEndpoints.some(endpoint => url.includes(endpoint));
  }