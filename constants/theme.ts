import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: '#1F41BB',
  secondary: '#CBD6FF',
  accent: '#4CD964',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  success: '#4CD964',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#8E8E93',
  lightGray: '#D1D1D6',
  primaryText: '#0A0A0A',
  secondaryText: '#8E8E93',
};

export const typography = {
  fontFamily: {
    regular: 'Poppins',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 35,
  },
  lineHeight: {
    xs: 15,
    sm: 18,
    md: 21,
    lg: 24,
    xl: 27,
    xxl: 30,
    xxxl: 36,
    display: 52,
  },
};

export const metrics = {
  screenWidth: width,
  screenHeight: height,
  screenPadding: 16,
  borderRadius: {
    sm: 5,
    md: 10,
    lg: 15,
    xl: 20,
  },
  spacing: {
    xs: 5,
    sm: 10,
    md: 15,
    lg: 20,
    xl: 25,
    xxl: 30,
  },
  buttonHeight: {
    sm: 40,
    md: 50,
    lg: 60,
  },
};