/**
 * @file errorUtils.ts
 * @description Central error handling utilities for API services
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export function handleApiError(
  error: unknown,
  context: string,
  defaultMessage: string
): ApiResponse<never> {
  const apiError = error as { response?: { data?: any }};
  return {
    success: false,
    error: {
      code: `${context}_ERROR`,
      message: apiError?.response?.data?.message || defaultMessage,
      details: apiError?.response?.data || error
    }
  };
}