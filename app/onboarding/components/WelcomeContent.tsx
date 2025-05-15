import React from 'react';
import { Image, Text, View } from 'react-native';
import { styles } from '../styles/welcomeStyles';

/**
 * Main content component for the welcome screen
 * Displays the illustration, title and subtitle
 */

export const WelcomeContent: React.FC = () => {
    return (
        <>
        <View style={styles.imageContainer}>
            <Image
             source={require('../../../assets/images/illustration.png')} 
             style={styles.illustration}
             resizeMode="contain"
             />
        </View>
        <View style={styles.cardContainer}>
            <Text style={styles.title}>Roadside assistance on Demand </Text>

            <Text style={styles.subtitle}>
                TowGro connects you with nearby towing towing services when you need them most.
            </Text>
        </View>

        </>
    );
};

// At the end of the file, add:
export default WelcomeContent;