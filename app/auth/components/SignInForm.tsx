/**
 * @file SignInForm.tsx
 * @description Modern React sign-in form with robust error handling and optimized rendering
 */
import { AntDesign } from '@expo/vector-icons';
import React, { memo, useEffect } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useSignInForm } from '../../hooks/auth/useSignInForm';
import Button from './Button';
import FormInput from './FormInput';
import { styles } from './SignInForm.styles';

/**
 * Memoized input field component to prevent unnecessary re-renders
 */
const InputField = memo(({ 
  field,
  value,
  onChange,
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
  onFocus,
  onBlur,
  isFocused,
  leftIcon,
  rightIcon
}: {
  field: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: string;
  error?: string;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  leftIcon: React.ReactNode;
  rightIcon?: React.ReactNode;
}) => (
  <FormInput
    value={value}
    onChangeText={onChange}
    placeholder={placeholder}
    keyboardType={keyboardType as any}
    secureTextEntry={secureTextEntry}
    error={error}
    onFocus={onFocus}
    onBlur={onBlur}
    isFocused={isFocused}
    leftIcon={leftIcon}
    rightIcon={rightIcon}
    testID={`input-${field}`}
  />
));

/**
 * General error display component
 */
const ErrorMessage = memo(({ message }: { message?: string }) => {
  if (!message) return null;
  
  return (
    <View style={styles.errorContainer}>
      <AntDesign name="exclamationcircle" size={16} color="#FF3B30" />
      <Text style={styles.generalError}>{message}</Text>
    </View>
  );
});

/**
 * Sign-in form component with optimized rendering and proper error handling
 */
const SignInForm: React.FC = () => {
  const {
    // Form state
    formData,
    errors,
    focusedInput,
    isSubmitting,
    biometricAvailable,
    isBiometricLoading,
    showPassword,
    isAuthenticated,
    isSessionValidated,
    
    // Event handlers
    handleChange,
    handleFocus,
    handleBlur,
    togglePasswordVisibility,
    handleSubmit,
    handleCreateAccount,
    handleForgotPassword,
    handleGoogleSignIn,
    handleBiometricAuth,
    handleLoginSuccess  // Now correctly accessed from the hook
  } = useSignInForm();
  
  // Effect to handle automatic redirect if already authenticated
  // This ensures users don't see the login form when already logged in
  useEffect(() => {
    if (isAuthenticated && isSessionValidated) {
      // Use the handleLoginSuccess from the hook
      handleLoginSuccess();
    }
  }, [isAuthenticated, isSessionValidated, handleLoginSuccess]);
  
  return (
    <View style={styles.form} testID="sign-in-form">
      <ErrorMessage message={errors.general} />
      
      <View style={styles.inputs}>
        <InputField
          field="email"
          value={formData.email}
          onChange={(value) => handleChange('email', value)}
          placeholder="Email or phone number"
          keyboardType="email-address"
          error={errors.email}
          onFocus={() => handleFocus('email')}
          onBlur={handleBlur}
          isFocused={focusedInput === 'email'}
          leftIcon={<AntDesign name="user" size={20} color="#1F41BB" />}
        />
        
        <InputField
          field="password"
          value={formData.password}
          onChange={(value) => handleChange('password', value)}
          placeholder="Password"
          secureTextEntry={!showPassword}
          error={errors.password}
          onFocus={() => handleFocus('password')}
          onBlur={handleBlur}
          isFocused={focusedInput === 'password'}
          leftIcon={<AntDesign name="lock" size={20} color="#1F41BB" />}
          rightIcon={
            <TouchableOpacity 
              onPress={togglePasswordVisibility}
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            >
              <AntDesign 
                name={showPassword ? "eye" : "eyeo"} 
                size={20} 
                color="#1F41BB" 
              />
            </TouchableOpacity>
          }
        />
        
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity 
            onPress={handleForgotPassword}
            accessibilityLabel="Forgot your password"
            accessibilityRole="button"
          >
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.actions}>
        <Button
          onPress={handleSubmit}
          title="Sign In"
          style={styles.signInButton}
          textStyle={styles.signInButtonText}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          accessibilityLabel="Sign in button"
          testID="submit-button"
        />
        
        <Button
          onPress={handleCreateAccount}
          title="Create an account"
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
          accessibilityLabel="Create a new account"
          testID="create-account-button"
        />
        
        <Button
          onPress={handleGoogleSignIn}
          title="Sign in with Google"
          style={styles.googleSignInButton}
          textStyle={styles.googleSignInText}
          icon={<AntDesign name="google" size={24} color="#4285F4" style={styles.googleLogo} />}
          accessibilityLabel="Sign in with Google account"
          testID="google-signin-button"
        />
      </View>

      {biometricAvailable && (
        <Button
          onPress={handleBiometricAuth}
          title="Scan Fingerprint"
          style={styles.biometricButton}
          textStyle={styles.biometricButtonText}
          disabled={isBiometricLoading}
          icon={isBiometricLoading ? 
            <ActivityIndicator color="#1F41BB" size="small" /> : 
            <AntDesign name="scan1" size={24} color="#1F41BB" />
          }
          accessibilityLabel="Sign in with fingerprint"
          testID="biometric-button"
        />
      )}
    </View>
  );
};

export default memo(SignInForm);