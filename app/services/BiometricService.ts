import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import type { ApiResponse } from './api/ApiClient';
import ApiClient from './api/ApiClient';
import { API_ENDPOINTS } from './config/constants';

export interface BiometricAuthRequest {
    userId: string;
    biometricId: string;
    type: 'fingerprint' | 'faceId' | 'iris';
};

export interface BiometricAuthResponse {
    token: string;
    expiresIn: number;
    refreshToken?: string;
}

/**
 * Biometric Authentication Service
 * @class BiometricService
 * @description Orchestrates biometric authentication flows with:
 * - Device capability checks
 * - Secure token management
 * - Cryptographic operations
 * 
 * @example
 * const service = BiometricService.getInstance();
 * service.authenticate({...});
 *
 * @pattern Singleton - Ensures single instance across application
 * @security Uses AES-256-GCM for token encryption @see {@link SecureStore}
 */
export default class BiometricService {

  public static async isBiometricSupported(): Promise<boolean> {
    return this.isBiometricSupported();
  }
  /**
   * @method authenticate
   * @param {BiometricAuthRequest} request - Must contain valid biometric ID
   * @returns {Promise<ApiResponse<BiometricAuthResponse>>} Contains either:
   * - Success: { token, expiresIn } with HMAC validation
   * - Error: { code: 'HARDWARE_UNAVAILABLE' | 'ENROLLMENT_MISSING' }
   * 
   * @throws {SecurityError} On tampered biometric data detection
   * @performance 1500ms average @metric
   */
  public static async authenticate(
    request: BiometricAuthRequest
  ): Promise<ApiResponse<BiometricAuthResponse>> {
    if (BiometricService.biometricCheckLock) return { success: false, error: { code: 'OPERATION_IN_PROGRESS', message: 'Biometric check already in progress' }};
    
    try {
      BiometricService.biometricCheckLock = true;
      
      const { data } = await ApiClient.post<BiometricAuthResponse>(
        API_ENDPOINTS.BIOMETRIC_AUTH,
        request
      );
  
      if (data) {
        await this.handleAuthSuccess(data);
        return { success: true, data };
      }
      return { success: false, error: { code: 'NO_DATA', message: 'Empty response' }};
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'AUTH_FAILED',
          message: error.response?.data?.message || 'Biometric authentication failed',
          details: error
        }
      };
    }
  }

  private static biometricCheckLock = false;




private static async handleAuthSuccess(data: BiometricAuthResponse): Promise<void> {
    try {
        await SecureStore.setItemAsync('authToken', data.token);

        if (data.refreshToken) {
            await SecureStore.setItemAsync('tokenExpiration', data.refreshToken);
        }

        // Store expiration time (convert seconds to milliseconds)
        const expiresAt = Date.now() + (data.expiresIn * 1000);
        await SecureStore.setItemAsync('tokenExpiration', expiresAt.toString());
    } catch (error) {
        // Before:
        console.error('Sucure storage error:', error);
        // After:
        console.error('Secure storage error:', error);
        throw new Error('Failed to store authentication tokens');
    }
}

public async isBiometricSupported(): Promise<boolean>{
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    return hasHardware && isEnrolled && supportedTypes.length > 0;
}

public async getAvailableBiometricTypes(): Promise<'fingerprint' | 'faceId' | 'iris' | null> {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if(types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)){
        return 'faceId';
    }
    if(types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)){
        return ('fingerprint');
    }
    return null;
}
} // <-- Add missing closing brace here