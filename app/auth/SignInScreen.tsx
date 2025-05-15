
// SignInScreen.tsx - Improved styling to match design
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import AuthHeader from './components/AuthHeader';
import SignInForm from './components/SignInForm';

/**
 * Sign-in screen component that composes the authentication UI
 * 
 * Features:
 * - Keyboard avoiding behavior for better UX on different devices
 * - Scrollable content to accommodate smaller screens
 * - Responsive layout with centered content
 * - SafeAreaView for iOS notch support
 * 
 * @returns {JSX.Element} Rendered component
 */
const SignInScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            <AuthHeader
              title="Login here"
              subtitle="Welcome back you've been missed!"
            />
            
            <SignInForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/**
 * Component styles
 * Uses flex layout for responsive behavior across different screen sizes
 */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 30,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
  }
});

export default SignInScreen;