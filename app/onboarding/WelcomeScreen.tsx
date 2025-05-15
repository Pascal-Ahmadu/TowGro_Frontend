import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import { ActionButtons } from './components/ActionButtons';
import { WelcomeContent } from './components/WelcomeContent';
import { WelcomeLayout } from './components/WelcomeLayout';
import { styles } from './styles/welcomeStyles'; // Fixed import path

type WelcomeNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

/**
 * 
 * Entry poiny for the onboarding flow that shows app  instructions
 * and provides options to  sign in or register
 */

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeNavProp>();

  const handleLoginPress = () => {
    navigation.navigate('SignIn');
  };

  const handleRegisterPress = () => {
    navigation.navigate('SignUp'); // Changed 'Register' to 'SignUp' to match RootStackParamList
  };

  return (
    <WelcomeLayout>
      <View style= {styles.content}>
        <WelcomeContent />
        <ActionButtons
          onLoginPress={handleLoginPress}
          onRegisterPress={handleRegisterPress}
        />
      </View>
    </WelcomeLayout>
  );
};

// Add this line at the end of the file
export default WelcomeScreen;

