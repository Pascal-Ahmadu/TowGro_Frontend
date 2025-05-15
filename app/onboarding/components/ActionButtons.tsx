import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/welcomeStyles';

interface ActionButtonsProps {
    onLoginPress: () => void;
    onRegisterPress: () => void;
}

/**
 * Component for the login and register buttons
 */

export const ActionButtons:  React.FC<ActionButtonsProps> = ({
    onLoginPress,
    onRegisterPress
}) =>{
    return(
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style ={styles.loginButton}
                onPress={onLoginPress}
                accessibilityLabel= 'Login Button'
                >
                    <Text style={styles.registerButtonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style ={styles.registerButton}
                onPress={onRegisterPress}
                accessibilityLabel= 'Register Button'
                >
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
        </View>

                
    );
};

// At the end of the file, add:
export default ActionButtons;