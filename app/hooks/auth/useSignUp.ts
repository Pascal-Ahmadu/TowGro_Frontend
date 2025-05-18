/**
 * @file useSignUp.ts
 * @description Custom hook for sign-up form logic and state management
 */
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import type { RootStackParamList } from '../../navigation/types';

// Type for navigation prop
type SignUpNavProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

/**
 * Form data structure for sign-up
 */
export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Custom hook for sign-up functionality
 */
export const useSignUp = () => {
  const navigation = useNavigation<SignUpNavProp>();
  
  // Form state
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * Updates form data when input changes
   */
  const handleChange = useCallback((field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Sets the currently focused input field
   */
  const handleFocus = useCallback((input: string) => {
    setFocusedInput(input);
  }, []);

  /**
   * Clears the focused input state
   */
  const handleBlur = useCallback(() => {
    setFocusedInput(null);
  }, []);

  /**
   * Handles sign up form submission
   */
  const handleSignUp = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      // Add actual signup API call here
      console.log('Sign up with:', formData);
      
      // Add navigation after successful signup
      navigation.navigate('Home');
    } catch (error) {
      console.error('Sign up error:', error);
      // Add error state handling
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, navigation]);

  /**
   * Navigates to sign in screen
   */
  const navigateToSignIn = useCallback(() => {
    navigation.navigate('SignIn');
  }, [navigation]);

  /**
   * Handles social media login (Google, Facebook, Apple)
   */
  const handleSocialLogin = useCallback((provider: 'google' | 'facebook' | 'apple') => {
    console.log(`Login with ${provider}`);
    // Implementation for social login would go here
  }, []);

  return {
    formData,
    focusedInput,
    isSubmitting,
    handleChange,
    handleFocus,
    handleBlur,
    handleSignUp,
    navigateToSignIn,
    handleSocialLogin
  };
};