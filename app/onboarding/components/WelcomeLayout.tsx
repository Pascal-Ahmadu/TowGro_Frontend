import { BlurView } from 'expo-blur';
import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { styles } from '../styles/welcomeStyles';

interface WelcomeLayoutProps {
    children: ReactNode;
}

/**
 * Layout wrapper for the welcome screen.
 * Handles the container and backround blur effect
 */

export const WelcomeLayout: React.FC<WelcomeLayoutProps> = ({children}) => {
    return (
        <View style={styles.container}>
            {/*Blur overlay*/}
            <BlurView intensity={25} tint='light' style={styles.blur} />
            {children}
        </View>
    )

}

// At the end of the file, add:
export default WelcomeLayout;