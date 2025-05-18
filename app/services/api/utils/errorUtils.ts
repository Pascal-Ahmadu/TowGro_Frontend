/**
 * @file errorUtils.ts (Updated)
 * @description Enhanced utilities for error handling and formatting
 */

/**
 * Standard error object structure
 */
export interface ApiError {
  code: "USER_NOT_FOUND" | "INVALID_CREDENTIALS" | "ACCOUNT_LOCKED" | 
        "NETWORK_UNAVAILABLE" | "MISSING_TOKEN" | "NETWORK_ERROR" | 
        "CORS_ERROR" | "TOO_MANY_REQUESTS" | "AUTH_ERROR" | "NO_DATA" |
        "VERIFICATION_ERROR" | "GOOGLE_AUTH_FAILED" | "INVALID_TOKEN" | 
        "TOKEN_EXPIRED" | "SESSION_NOT_ESTABLISHED" | "EMAIL_ALREADY_EXISTS" |
        "RESET_TOKEN_INVALID" | "NO_SESSION" | string;
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

  // Check if this is a "No user found" error from logs
  const errorString = JSON.stringify(error).toLowerCase();
  if (errorString.includes('no user found') || 
      errorString.includes('[authservice] no user found') ||
      errorString.includes('[usersservice] searching user')) {
    return {
      code: 'USER_NOT_FOUND',
      message: 'No account found with this email. Please check your credentials or create an account.'
    };
  }

  if (error.response) {
    // Server responded with an error status
    const status = error.response.status;
    
    // Handle common HTTP status codes
    switch(status) {
      case 400:
        apiError.code = 'BAD_REQUEST';
        apiError.message = error.response.data?.message || 'Invalid request';
        break;
      case 401:
        apiError.code = error.response.data?.code === 'TOKEN_EXPIRED' ? 
          'TOKEN_EXPIRED' : 'UNAUTHORIZED';
        apiError.message = error.response.data?.message || 'Authentication required';
        break;
      case 403:
        apiError.code = 'FORBIDDEN';
        apiError.message = error.response.data?.message || 'Access denied';
        break;
      case 404:
        apiError.code = 'NOT_FOUND';
        apiError.message = error.response.data?.message || 'Resource not found';
        break;
      case 409:
        apiError.code = 'CONFLICT';
        apiError.message = error.response.data?.message || 'Resource conflict';
        break;
      case 429:
        apiError.code = 'TOO_MANY_REQUESTS';
        apiError.message = error.response.data?.message || 'Too many requests';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        apiError.code = 'SERVER_ERROR';
        apiError.message = error.response.data?.message || 'Server error';
        break;
      default:
        apiError.code = `SERVER_ERROR_${status}`;
        apiError.message = error.response.data?.message || `Error ${status}`;
    }
    
    apiError.details = error.response.data;
  } else if (error.request) {
    // Request was made but no response received
    apiError.code = 'NETWORK_ERROR';
    apiError.message = 'No response received from server';
    apiError.isNetworkError = true;
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

/**
 * Check if error response indicates a server-side problem
 * @param error - Error object
 * @returns Boolean indicating if this is a server error
 */
export function isServerError(error: any): boolean {
  return error.response?.status >= 500 && error.response?.status < 600;
}

/**
 * Extract the most user-friendly error message from an error object
 * @param error - Error object
 * @returns Human-readable error message
 */
export function getReadableErrorMessage(error: any): string {
  // Try to get the most specific message first
  return error.response?.data?.message || 
         error.response?.data?.error?.message ||
         error.message ||
         'An unknown error occurred';
}