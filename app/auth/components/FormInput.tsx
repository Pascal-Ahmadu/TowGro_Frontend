import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

interface FormInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: TextInput['props']['keyboardType'];
  autoCapitalize?: TextInput['props']['autoCapitalize'];
  secureTextEntry?: boolean;
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  testID?: string;
}

/**
 * A reusable form input component with error handling and focus states
 * 
 * Features:
 * - Visual feedback for focus state
 * - Error message display
 * - Configurable keyboard types
 * - Password input support
 * 
 * @param {FormInputProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const FormInput: React.FC<FormInputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  onFocus,
  onBlur,
  isFocused,
}) => {
  const inputRef = React.useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputWrapper}>
      <TouchableWithoutFeedback 
        onPress={() => inputRef.current?.focus()}
        style={styles.touchableWrapper}
      >
        <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#424242"
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {secureTextEntry && (
            <TouchableOpacity 
              style={styles.iconContainer}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#424242"
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Add to styles:
const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 16, // Space below each input field
    marginTop: 10,    // Add space above each input field
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#E5E9F2',
    borderRadius: 10,
    padding: 20,
    borderWidth: 2, // Add border here instead
    borderColor: 'transparent', // Default transparent border
  },
  inputContainerFocused: {
    borderColor: '#1F41BB', // Only change border color on focus
    // Remove borderWidth from here
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Poppins',
  },
  touchableWrapper: {
    width: '100%',
    height: '100%'
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    height: '100%',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#000000',
    padding: 0,
    paddingRight: 48, // Increased from 40
  },
});

export default FormInput;