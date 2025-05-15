/**
 * @file SignInForm.styles.ts
 * @description Styles for the SignInForm component
 */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  form: {
    width: '100%',
    maxWidth: 357,
    marginTop: 40,
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEB',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  generalError: {
    color: '#FF3B30',
    fontFamily: 'Poppins',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  inputs: {
    width: '100%',
    marginBottom: 25,
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotPassword: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
    color: '#1F41BB',
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 18,
  },
  signInButton: {
    backgroundColor: '#1F41BB',
    shadowColor: '#CBD6FF',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#494949',
    fontSize: 14,
    lineHeight: 21,
  },
  googleSignInButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#CBD6FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  googleLogo: {
    marginRight: 8,
  },
  googleSignInText: {
    color: '#4285F4',
    fontSize: 16,
    lineHeight: 24,
  },
  biometricButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1F41BB',
    marginTop: 20
  },
  biometricButtonText: {
    color: '#1F41BB',
    fontWeight: '500',
  }
});