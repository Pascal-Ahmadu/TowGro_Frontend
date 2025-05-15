// app/styles/welcomeStyles.ts
import { Dimensions, StyleSheet } from 'react-native';
import { colors, metrics, typography } from '../../../constants/theme';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Layout styles
  container: {
    flex: 1,
    width: '100%',
  },
  blur: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.47)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: metrics.screenPadding,
    paddingTop: height * 0.15,
    paddingBottom: height * 0.1,
  },
  
  // Image styles
  imageContainer: {
    width: width - metrics.screenPadding * 2,
    height: height * 0.4,
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    borderRadius: metrics.borderRadius.xl,
    padding: metrics.spacing.xxl,
    paddingHorizontal: metrics.spacing.xs,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: '90%',
    flexGrow: 0,
  },
  
  // Text content styles
  cardContainer: {
    position: 'absolute',
    width: 343,
    height: 171,
    left: 42,
    top: 519,
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    width: 343,
    height: 106,
    left: 0,
    top: 0,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 35,
    lineHeight: 52,
    textAlign: 'center',
    color: '#1F41BB',
  },
  subtitle: {
    position: 'absolute',
    width: 323,
    height: 42,
    left: 10,
    top: 129,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: '#000000',
  },
  
  // Button styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: metrics.spacing.xxl,
    position: 'absolute',
    width: width - metrics.screenPadding * 2,
    height: metrics.buttonHeight.lg,
    alignSelf: 'center',
    bottom: height * 0.1,
  },
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.lg,
    width: (width - metrics.screenPadding * 4) / 2,
    height: metrics.buttonHeight.lg,
    backgroundColor: colors.primary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    borderRadius: metrics.borderRadius.md,
  },
  loginButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontWeight: '600',
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
    textAlign: 'center',
    color: colors.white,
  },
  registerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.lg,
    width: (width - metrics.screenPadding * 4) / 2,
    height: metrics.buttonHeight.lg,
    backgroundColor: colors.white,
    borderRadius: metrics.borderRadius.md,
  },
  registerButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontWeight: '600',
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
    textAlign: 'center',
    color: colors.primaryText,
  },
});

// At the end of the file, add:
export default styles;