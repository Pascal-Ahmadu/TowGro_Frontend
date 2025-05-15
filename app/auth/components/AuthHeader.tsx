/**
 * @file AuthHeader.tsx
 * @description Reusable header component for authentication screens.
 * Displays a title and subtitle with consistent styling across the auth flow.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Props for the AuthHeader component
 * @typedef {Object} AuthHeaderProps
 * @property {string} title - The main heading text to display
 * @property {string} subtitle - The secondary text displayed below the title
 */
interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

/**
 * A reusable header component for authentication screens
 * 
 * @param {AuthHeaderProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

/**
 * Component styles
 * Note: Uses fixed width and margin values to maintain consistent
 * layout across different authentication screens
 */
const styles = StyleSheet.create({
  header: {
    width: '100%',
    maxWidth: 357,
    marginTop: 150,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 45,
    textAlign: 'center',
    color: '#1F41BB',
  },
  subtitle: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    color: '#000000',
    marginTop: 10,
  },
});

export default AuthHeader;