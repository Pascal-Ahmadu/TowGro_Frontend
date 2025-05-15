/**
 * @file SignUpScreen.tsx
 * @description Sign up screen component with form inputs and social sign-up options
 */
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSignUp } from '../hooks/auth/useSignUp';
import AuthHeader from './components/AuthHeader';
import Button from './components/Button';
import FormInput from './components/FormInput';
import { styles } from './components/signUpForm.styles';


const SignUpScreen: React.FC = () => {
  const {
    formData,
    focusedInput,
    isSubmitting,
    handleChange,
    handleFocus,
    handleBlur,
    handleSignUp,
    navigateToSignIn,
    handleSocialLogin
  } = useSignUp();

  const renderSocialButton = (Icon: React.FC, provider: 'google' | 'facebook' | 'apple') => {
    return (
      <TouchableOpacity 
        style={styles.socialButton}
        onPress={() => handleSocialLogin(provider)}
      >
        <Icon />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Background decorative elements */}
      <View style={styles.backgroundElements}>
        <View style={styles.ellipse1} />
        <View style={styles.ellipse2} />
        <View style={styles.rectangle3} />
        <View style={styles.rectangle4} />
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentContainer}>
          {/* Header */}
          <AuthHeader 
            title="Create Account" 
            subtitle="Create an account so you can explore all the existing jobs" 
          />
          
          {/* Form */}
          <View style={styles.formContainer}>
           
            
            <FormInput
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Email or phone number"
              keyboardType="email-address"
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              isFocused={focusedInput === 'email'}
            />
            
            <FormInput
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              placeholder="Password"
              secureTextEntry
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              isFocused={focusedInput === 'password'}
            />

            <FormInput
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              placeholder="Confirm Password"
              secureTextEntry
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={handleBlur}
              isFocused={focusedInput === 'confirmPassword'}
            />
            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <Button
                title="Sign up"
                onPress={handleSignUp}
                isLoading={isSubmitting}
                variant="primary"
                style={{ backgroundColor: '#1F41BB' }}
              />
              
              {/* Replace Button with TouchableOpacity and Text */}
              <TouchableOpacity onPress={navigateToSignIn}>
                <Text style={styles.secondaryButtonText}>
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Social Media Login */}
          <View style={styles.socialMediaContainer}>
            <Text style={styles.socialText}>Or continue with</Text>
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('google')}
              >
                <AntDesign name="google" size={24} color="#4285F4" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;