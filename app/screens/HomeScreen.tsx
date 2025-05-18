import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AuthService from '../services/AuthService'; // Adjust the import path if necessary
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';

// Define the navigation prop type
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  // Get the navigation object with proper typing
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // Call logout service
              const response = await AuthService.logout();
              
              if (!response.success) {
                // Log the error but continue with navigation
                console.error('Logout failed:', response.error?.message);
              }
              
              // Always navigate to SignIn screen regardless of API response
              // since we're clearing the auth token client-side anyway
              console.log('Navigating to SignIn after logout attempt');
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'SignIn' }],
                })
              );
              
            } catch (error) {
              console.error('Logout error:', error);
              // Still navigate to SignIn since we're clearing auth token
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'SignIn' }],
                })
              );
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      <Text style={styles.subtitle}>You are successfully logged in.</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;