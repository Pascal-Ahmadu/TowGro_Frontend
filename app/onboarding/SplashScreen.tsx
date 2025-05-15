// app/onboarding/SplashScreen.tsx
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';

const { width, height } = Dimensions.get('window');

type SplashNavProp = NativeStackNavigationProp<RootStackParamList>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashNavProp>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Add navigation verification
      console.log('Navigating to Welcome screen');
      navigation.dispatch(StackActions.replace('Welcome'));
    }, 2000);
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/icon.png')} // or another appropriate image
        style={styles.logo}
        resizeMode="contain"
      />
      <BlurView intensity={50} tint="light" style={styles.blur} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    zIndex: 2,
  },
  blur: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgba(255,255,255,0.47)',
  },
});
