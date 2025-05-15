/**
 * @file SignUpScreen.styles.ts
 * @description Styles for the SignUpScreen component
 */
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  ellipse1: {
    position: 'absolute',
    width: 635,
    height: 635,
    left: width / 4,
    top: -332,
    backgroundColor: '#F8F9FF',
    borderRadius: 635 / 2,
  },
  ellipse2: {
    position: 'absolute',
    width: 496,
    height: 496,
    left: 18,
    top: -147,
    borderWidth: 3,
    borderColor: '#F8F9FF',
    borderRadius: 496 / 2,
  },
  rectangle3: {
    position: 'absolute',
    width: 372,
    height: 372,
    left: -222,
    top: height - 300,
    borderWidth: 2,
    borderColor: '#F1F4FF',
    transform: [{ rotate: '16.01deg' }],
  },
  rectangle4: {
    position: 'absolute',
    width: 372,
    height: 372,
    left: -286,
    top: height - 260,
    borderWidth: 2,
    borderColor: '#F1F4FF',
  },
  scrollContainer: {
    flexGrow: 1,
    zIndex: 1,
  },
  contentContainer: {
    paddingHorizontal: 31,
    paddingTop: 90,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 428,
    alignSelf: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 50,
    marginTop: 20,    // Add space between header and form
  },
  actionsContainer: {
    width: '100%',
    marginTop: 20,
  },
  socialMediaContainer: {
    alignItems: 'center',
    marginTop: 35,
  },
  socialText: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
    color: '#1F41BB',
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  socialButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF'
  },
  headerContainer: {
    position: 'absolute',
    width: 326,
    height: 93,
    left: 51,
    top: 97,
    alignItems: 'center',
  },
  headerTitle: {
    width: 248,
    height: 45,
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 45,
    textAlign: 'center',
    color: '#1F41BB',
  },
  headerSubtitle: {
    width: 326,
    height: 42,
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: '#000000',
    marginTop: 7,
  },
  
  inputContainer: {
    gap: 26,
    width: '100%',
  },
  input: {
    width: 357,
    height: 64,
    backgroundColor: '#F1F4FF',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#626262',
  },
  activeInput: {
    borderColor: '#1F41BB',
  },
  primaryButton: {
    width: 357,
    height: 60,
    backgroundColor: '#1F41BB',
    borderRadius: 10,
    // Update to match the CSS specifications
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
    gap: 10,
    shadowColor: '#CBD6FF',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonText: {
    width: 79,
    height: 30,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    height: 41,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#494949',
    textAlign: 'center',
    width: '100%',
    marginTop: 15,
  }

});