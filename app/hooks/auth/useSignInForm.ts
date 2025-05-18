/**
 * @file useSignInForm.ts
 * @description Custom hook for sign-in form logic with clean Redux integration and modern React patterns
 */
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Google from 'expo-auth-session/providers/google';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootStackParamList } from '../../navigation/types';
import AuthService from '../../services/AuthService';
import { STORAGE_KEYS } from '../../services/config/constants';
import { handleApiError } from '../../services/utils/errorUtils';
import { RootState } from '../../store';
import { loginSuccess, logoutSuccess, sessionValidated } from '../../store/authSlice';

// Type for navigation prop
type SignInNavProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

/**
 * Form data structure for sign-in
 */
export interface FormData {
  email: string;
  password: string;
}

/**
 * Error state structure for form validation
 */
export interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

// State interface for useReducer to handle complex form state
interface SignInState {
  formData: FormData;
  errors: FormErrors;
  focusedInput: string | null;
  isSubmitting: boolean;
  isBiometricLoading: boolean;
  biometricAvailable: boolean;
  showPassword: boolean;
}

// Action types for the reducer
type SignInAction =
  | { type: 'SET_FIELD_VALUE'; field: keyof FormData; value: string }
  | { type: 'SET_FOCUSED_INPUT'; input: string | null }
  | { type: 'SET_ERRORS'; errors: FormErrors }
  | { type: 'CLEAR_FIELD_ERROR'; field: keyof FormErrors }
  | { type: 'CLEAR_GENERAL_ERROR' }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_BIOMETRIC_LOADING'; isLoading: boolean }
  | { type: 'SET_BIOMETRIC_AVAILABLE'; available: boolean }
  | { type: 'TOGGLE_PASSWORD_VISIBILITY' };

// Initial state
const initialState: SignInState = {
  formData: { email: '', password: '' },
  errors: {},
  focusedInput: null,
  isSubmitting: false,
  isBiometricLoading: false,
  biometricAvailable: false,
  showPassword: false,
};

// Reducer function
function signInReducer(state: SignInState, action: SignInAction): SignInState {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };
    case 'SET_FOCUSED_INPUT':
      return { ...state, focusedInput: action.input };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'CLEAR_FIELD_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: undefined },
      };
    case 'CLEAR_GENERAL_ERROR':
      return {
        ...state,
        errors: { ...state.errors, general: undefined },
      };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting };
    case 'SET_BIOMETRIC_LOADING':
      return { ...state, isBiometricLoading: action.isLoading };
    case 'SET_BIOMETRIC_AVAILABLE':
      return { ...state, biometricAvailable: action.available };
    case 'TOGGLE_PASSWORD_VISIBILITY':
      return { ...state, showPassword: !state.showPassword };
    default:
      return state;
  }
}

/**
 * Custom hook for sign-in form functionality with clean Redux integration
 */
export const useSignInForm = () => {
  const navigation = useNavigation<SignInNavProp>();
  const dispatch = useDispatch();
  const [state, dispatchFormAction] = useReducer(signInReducer, initialState);
  
  // Get auth state from Redux store
  const { isAuthenticated, sessionValidated: isSessionValidated, loading: authLoading } = 
    useSelector((state: RootState) => state.auth);

  // Google authentication setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'YOUR_CLIENT_ID',
    iosClientId: 'YOUR_CLIENT_ID',
    scopes: ['profile', 'email'],
  });

  // Check for biometric authentication support
  useEffect(() => {
    const checkBiometricSupport = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        
        if (hasHardware) {
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();
          dispatchFormAction({ 
            type: 'SET_BIOMETRIC_AVAILABLE', 
            available: isEnrolled 
          });
        }
      } catch (error) {
        console.error('Biometric check failed:', error);
        dispatchFormAction({ type: 'SET_BIOMETRIC_AVAILABLE', available: false });
      }
    };
    
    checkBiometricSupport();
  }, []);

  /**
   * Centralized login success handler
   * Manages all post-authentication actions in one place
   */
  const handleLoginSuccess = useCallback(() => {
    // 1. Dispatch Redux action to update auth state
    // Fix: Pass undefined to satisfy the action creator's expected argument
    dispatch(loginSuccess(undefined));
    
    // 2. Navigate to main app screens with safe fallbacks
    const destinations = ['Home'];
    let navigated = false;

    // Try each destination until one works
    for (const destination of destinations) {
      if (!navigated) {
        try {
          navigation.navigate(destination as never);
          navigated = true;
          console.log(`Navigation to ${destination} successful`);
          break;
        } catch (error) {
          console.warn(`Navigation to ${destination} failed:`, error);
        }
      }
    }

    // If all navigation attempts failed
    if (!navigated) {
      console.error('All navigation attempts failed');
      dispatchFormAction({ 
        type: 'SET_ERRORS', 
        errors: { general: 'Navigation error after successful login' } 
      });
    }
  }, [dispatch, navigation]);

  /**
   * Updates form data and clears field-specific errors
   */
  const handleChange = useCallback((field: keyof FormData, value: string) => {
    dispatchFormAction({ type: 'SET_FIELD_VALUE', field, value });
    dispatchFormAction({ type: 'CLEAR_FIELD_ERROR', field });
    dispatchFormAction({ type: 'CLEAR_GENERAL_ERROR' });
  }, []);

  /**
   * Sets the currently focused input field
   */
  const handleFocus = useCallback((input: string) => {
    dispatchFormAction({ type: 'SET_FOCUSED_INPUT', input });
  }, []);

  /**
   * Clears the focused input state
   */
  const handleBlur = useCallback(() => {
    dispatchFormAction({ type: 'SET_FOCUSED_INPUT', input: null });
  }, []);

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = useCallback(() => {
    dispatchFormAction({ type: 'TOGGLE_PASSWORD_VISIBILITY' });
  }, []);

  /**
   * Validates form data before submission
   */
  const validateForm = useCallback((): boolean => {
    const { formData } = state;
    const newErrors: FormErrors = {};

    // Email or phone number validation
    const identifier = formData.email.trim(); // Use 'email' field for identifier input

    if (!identifier) {
      newErrors.email = 'Email or phone number is required';
    } else if (identifier.includes('@')) {
      // Basic email format check
      if (!/\S+@\S+\.\S+/.test(identifier)) {
        newErrors.email = 'Email is invalid';
      }
    } else {
      // Basic phone number format check (adjust regex as needed for your backend)
      const cleanPhone = identifier.replace(/[^\d+]/g, '');
      if (!cleanPhone.match(/^\+?\d{10,15}$/)) { // Adjusted regex for common phone formats
        newErrors.email = 'Please enter a valid email or phone number';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    dispatchFormAction({ type: 'SET_ERRORS', errors: newErrors });
    return Object.keys(newErrors).length === 0;
  }, [state.formData]);


  /**
   * Handles form submission with robust error handling
   */
  const handleSubmit = async () => {
    dispatchFormAction({ type: 'SET_SUBMITTING', isSubmitting: true }); // Set submitting true at the start
    dispatchFormAction({ type: 'SET_ERRORS', errors: {} }); // Clear previous errors

    // Perform validation
    if (!validateForm()) {
       dispatchFormAction({ type: 'SET_SUBMITTING', isSubmitting: false }); // Set submitting false on validation error
       return; // Stop submission if validation fails
    }

    try {
      // Make API call for login with a single object argument
      console.log('🚀 [POST] /api/v1/auth/login', { identifier: state.formData.email, password: state.formData.password }); // Log the attempt
      const response = await AuthService.login({ // Pass an object here
        identifier: state.formData.email, // Use email field as the identifier
        password: state.formData.password
      });
      console.log('Login API Response:', response); // Log the response

      if (response.success) {
        console.log('Login successful, handling success...');
        // Handle successful login (e.g., store tokens)
        // Assuming AuthService.login handles token storage internally or returns data needed for it
        // ... existing success handling if any ...

        // Set submitting false immediately on success
        dispatchFormAction({ type: 'SET_SUBMITTING', isSubmitting: false });

        // Dispatch Redux action to update auth state
        // Fix: Pass undefined to satisfy the action creator's expected argument
        dispatch(loginSuccess(undefined)); // This should update isAuthenticated

        // Navigate to main app screens
        handleLoginSuccess(); // This function already handles navigation

      } else {
        console.error('Login failed:', response.error);
        // Handle API errors
        dispatchFormAction({ type: 'SET_ERRORS', errors: { general: response.error?.message || 'Login failed' } });
        // Set submitting false on API error
        dispatchFormAction({ type: 'SET_SUBMITTING', isSubmitting: false });
      }

    } catch (error) {
      console.error('Login error:', error);
      // Handle network or unexpected errors
      dispatchFormAction({ type: 'SET_ERRORS', errors: { general: 'An unexpected error occurred. Please try again.' } });
      // Set submitting false on unexpected error
      dispatchFormAction({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  };

  /**
   * Navigates to the sign-up screen
   */
  const handleCreateAccount = useCallback(() => {
    navigation.navigate('SignUp' as never);
  }, [navigation]);

  /**
   * Navigates to the forgot password screen
   */
  const handleForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword' as never);
  }, [navigation]);

  /**
   * Handles Google sign-in
   */
  const handleGoogleSignIn = useCallback(async () => {
    try {
      await promptAsync();
    } catch (error) {
      const apiError = handleApiError(error, 'GOOGLE_AUTH', 'Google authentication failed');
      
      dispatchFormAction({
        type: 'SET_ERRORS',
        errors: { general: apiError.error?.message }
      });
    }
  }, [promptAsync]);

  // Handle Google auth response
  useEffect(() => {
    if (response?.type === 'success') {
      const handleGoogleAuthSuccess = async () => {
        dispatchFormAction({ type: 'SET_SUBMITTING', isSubmitting: true });
        
        try {
          const authResult = await AuthService.loginWithGoogle(
            response.authentication?.accessToken ?? ''
          );
          
          if (authResult.success && authResult.data) {
            // Use centralized login success handler
            handleLoginSuccess();
          } else {
            dispatchFormAction({
              type: 'SET_ERRORS',
              errors: { general: authResult.error?.message || 'Google authentication failed' }
            });
          }
        } catch (error) {
          const apiError = handleApiError(error, 'GOOGLE_AUTH', 'Google authentication failed');
          
          dispatchFormAction({
            type: 'SET_ERRORS',
            errors: { general: apiError.error?.message }
          });
        } finally {
          dispatchFormAction({ type: 'SET_SUBMITTING', isSubmitting: false });
        }
      };
      
      handleGoogleAuthSuccess();
    }
  }, [response, handleLoginSuccess]);

  /**
   * Handles biometric authentication
   */
  const handleBiometricAuth = useCallback(async () => {
    dispatchFormAction({ type: 'SET_BIOMETRIC_LOADING', isLoading: true });
    dispatchFormAction({ type: 'CLEAR_GENERAL_ERROR' });
    
    try {
      // Step 1: Authenticate with device biometrics
      const biometricResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false
      });
  
      if (biometricResult.success) {
        // Step 2: Retrieve stored credentials from secure storage
        const storedIdentifier = await SecureStore.getItemAsync(STORAGE_KEYS.USER_IDENTIFIER);
        const storedToken = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        
        if (storedToken) {
          // Option 1: Use stored token for authentication
          const verifyResult = await AuthService.verifyToken(storedToken);
          
          if (verifyResult.success) {
            // Use centralized login success handler
            handleLoginSuccess();
            return;
          }
          // Token invalid, fall through to credential-based auth
        }
        
        if (storedIdentifier) {
          // Option 2: Use stored credentials with biometric authentication
          const authResult = await AuthService.loginWithBiometricFallback({
            identifier: storedIdentifier,
            password: '' // Password not needed for biometric auth
          });
          
          if (authResult.success && authResult.data) {
            // Use centralized login success handler
            handleLoginSuccess();
          } else {
            dispatchFormAction({
              type: 'SET_ERRORS',
              errors: { general: authResult.error?.message || 'Authentication failed' }
            });
          }
        } else {
          // No stored credentials
          dispatchFormAction({
            type: 'SET_ERRORS',
            errors: {
              general: 'No stored credentials found. Please sign in with email and password first.'
            }
          });
        }
      } else if (biometricResult.error === 'user_cancel') {
        // User canceled, no error needed
      } else {
        dispatchFormAction({
          type: 'SET_ERRORS',
          errors: { general: 'Biometric authentication failed' }
        });
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
      
      dispatchFormAction({
        type: 'SET_ERRORS',
        errors: { 
          general: error instanceof Error 
            ? error.message 
            : 'Biometric authentication failed' 
        }
      });
    } finally {
      dispatchFormAction({ type: 'SET_BIOMETRIC_LOADING', isLoading: false });
    }
  }, [handleLoginSuccess]);

  // Function to handle logout with redux sync
  const handleLogout = useCallback(async () => {
    try {
      // Set UI to loading state first
      dispatchFormAction({ type: 'SET_SUBMITTING', isSubmitting: true });
      
      const logoutResult = await AuthService.logout();
      
      // Always dispatch logout action, regardless of API success
      dispatch(logoutSuccess());
      
      // Clean up biometric and secure storage keys
      try {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_IDENTIFIER);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
      } catch (storageError) {
        console.warn('Failed to clear secure storage:', storageError);
      }
      
      // Navigate back to sign-in screen
      navigation.navigate('SignIn' as never);
    } catch (error) {
      console.error('Logout error:', error);
      
      // Force logout even if API request fails
      dispatch(logoutSuccess());
      navigation.navigate('SignIn' as never);
    } finally {
      dispatchFormAction({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  }, [dispatch, navigation]);

  // Handle session validation on component mount
  useEffect(() => {
    const validateUserSession = async () => {
      try {
        // Only validate if not already validated
        if (!isSessionValidated) {
          const sessionResult = await AuthService.validateSession();
          if (sessionResult.success) {
            dispatch(sessionValidated());
            
            // If session is valid and contains authentication tokens,
            // we can also set the authenticated state
            if (sessionResult.data?.isAuthenticated) {
              // Fix: Pass undefined to satisfy the action creator's expected argument
              dispatch(loginSuccess(undefined));
            }
          }
        }
      } catch (error) {
        console.error('Session validation error:', error);
      }
    };
    
    validateUserSession();
  }, [dispatch, isSessionValidated]);

  // Memoize values to prevent unnecessary re-renders
  const formValues = useMemo(() => ({
    formData: state.formData,
    errors: state.errors,
    focusedInput: state.focusedInput,
    isSubmitting: state.isSubmitting || authLoading, // Combine local and Redux loading states
    biometricAvailable: state.biometricAvailable,
    isBiometricLoading: state.isBiometricLoading,
    showPassword: state.showPassword,
    isAuthenticated, // Expose Redux auth state
    isSessionValidated,
  }), [state, authLoading, isAuthenticated, isSessionValidated]);

  // Memoize handlers to prevent unnecessary re-renders
  const handlers = useMemo(() => ({
    handleChange,
    handleFocus,
    handleBlur,
    togglePasswordVisibility,
    handleSubmit,
    handleCreateAccount,
    handleForgotPassword,
    handleGoogleSignIn,
    handleBiometricAuth,
    handleLoginSuccess,  // Expose the handleLoginSuccess function
    handleLogout
  }), [
    handleChange,
    handleFocus,
    handleBlur,
    togglePasswordVisibility,
    handleSubmit,
    handleCreateAccount,
    handleForgotPassword,
    handleGoogleSignIn,
    handleBiometricAuth,
    handleLoginSuccess,
    handleLogout
  ]);

  return {
    ...formValues,
    ...handlers
  };
};
