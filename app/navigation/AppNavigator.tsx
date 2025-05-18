// app/navigation/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SignInScreen from '../auth/SignInScreen';
import SignUpScreen from '../auth/SignUpScreen'; // Add missing import
import { SplashScreen, WelcomeScreen } from '../onboarding';
import HomeScreen from '../screens/HomeScreen';

// Define the type for navigation params
type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  ForgotPassword: undefined;
  // other screens...
};

// Create the navigator with proper type
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <Stack.Navigator 
    initialRouteName="Splash"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AppNavigator;