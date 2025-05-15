/**
 * @file constants.ts
 * @description Application constants for API endpoints and storage keys
 */

/**
 * API endpoints used throughout the application
 */
export const API_ENDPOINTS = {
  BIOMETRIC_AUTH: '/api/v1/auth/biometric/authenticate',
  TOKEN_REFRESH: '/api/v1/auth/refresh',
  LOGIN: '/api/v1/auth/login',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  VERIFY_EMAIL: "/api/v1/auth/verify-email",
  REGISTER: '/api/v1/auth/register',
  RESET_PASSWORD: '/api/v1/auth/reset-password',
  GOOGLE_AUTH: '/api/v1/auth/google',
  GOOGLE_CALLBACK: '/api/v1/auth/google/callback',
  LOGOUT: '/api/v1/auth/logout',
  USER_PROFILE: '/api/v1/users/profile', // Add this line
};

/**
 * Storage keys for secure storage
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRATION: 'tokenExpiration', // Fixed the space before token name
  USER_IDENTIFIER: 'userIdentifier',    // Added new key for biometric login
  BIOMETRIC_ENABLED: 'biometricEnabled', // Added flag to track biometric enrollment
  SESSION_COOKIE: 'sessionCookie'       // Add this line for session-based auth
};

export default { API_ENDPOINTS, STORAGE_KEYS };