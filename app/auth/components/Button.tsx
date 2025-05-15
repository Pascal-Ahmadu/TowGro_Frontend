/**
 * @file Button.tsx
 * @description A reusable button component that supports various styles, icons, and loading states.
 * Provides consistent button behavior and appearance across the application.
 */
import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

/**
 * Props for the Button component
 * @typedef {Object} ButtonProps
 * @property {function} onPress - Handler for button press events
 * @property {string} title - Text to display on the button
 * @property {StyleProp<ViewStyle>} [style] - Optional custom styles for the button container
 * @property {StyleProp<TextStyle>} [textStyle] - Optional custom styles for the button text
 * @property {React.ReactNode} [icon] - Optional icon to display before the button text
 * @property {boolean} [isLoading=false] - Whether the button is in a loading state
 */
interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  // Add the missing properties
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

/**
 * A reusable button component with support for custom styling, icons, and loading states
 * 
 * Features:
 * - Customizable appearance through style props
 * - Support for leading icons
 * - Loading state handling
 * - Disabled state when loading
 * 
 * @param {ButtonProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const Button: React.FC<ButtonProps> = ({ 
  onPress, 
  title, 
  style, 
  textStyle, 
  icon, 
  isLoading = false,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
  testID
}) => {
  // Determine button style based on variant
  const buttonStyle = [
    styles.button,
    variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
    style
  ];
  
  // Determine text style based on variant
  const textStyleFinal = [
    styles.buttonText,
    variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText,
    textStyle
  ];
  
  return (
    <TouchableOpacity 
      style={buttonStyle} 
      onPress={onPress}
      disabled={isLoading || disabled}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {icon}
      <Text style={textStyleFinal}>{isLoading ? 'Loading...' : title}</Text>
    </TouchableOpacity>
  );
};

/**
 * Base button styles that can be extended through the style prop
 * Follows the application's design system for consistent appearance
 */
const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  primaryButton: {
    backgroundColor: '#1F41BB',
    shadowColor: '#CBD6FF',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#494949',
  },
});

export default Button;