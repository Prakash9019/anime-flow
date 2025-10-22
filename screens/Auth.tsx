// screens/Auth.tsx
import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Logo from '../components/Logo';
import AuthOptions from '../components/AuthOptions';
import { COLORS, FONTS, SIZES } from '../theme';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthNavProp = NativeStackNavigationProp<RootStackParamList, 'UserAuth'>;

export default function Auth(): React.ReactElement {
  const navigation = useNavigation<AuthNavProp>();
  
    useEffect(() => {
      checkAuthStatus();
    }, []);
  
    const checkAuthStatus = async () => {
      try {
           const token = await AsyncStorage.getItem('token');
           console.log('User token:', token);
        // Wait for minimum splash duration
        await new Promise(resolve => setTimeout(resolve, 1500));
  
        // Check for user token
        // const token = await AsyncStorage.getItem('token');
        const adminToken = await AsyncStorage.getItem('adminToken');
  
        if (adminToken) {
          // Admin is logged in
          navigation.replace('AdminMain');
        } else if (token) {
          // User is logged in
          navigation.replace('UserMain');
        } 
      } catch (error) {
        console.error('Auth check error:', error);
        // On error, go to auth screen
        navigation.replace('UserAuth');
      }
    };
  const [showSheet, setShowSheet] = useState(false);

  const openAuthOptions = () => setShowSheet(true);
  const closeAuthOptions = () => {
    setShowSheet(false);
  };
  const goAdmin = () => navigation.replace('AdminLogin');
     const handleAuthSuccess = () => {
    setShowSheet(false);
    navigation.replace('UserMain');
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('../assets/images/bg-collage.jpg')}
        style={styles.background}
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.container}>
          <Logo size={84} tint={COLORS.cyan} />
          <Text style={styles.title}>ANIME FLOW</Text>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.buttons}
          >
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={openAuthOptions}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryText}>SIGN UP / LOG IN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={goAdmin}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryText}>Admin Mode</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </SafeAreaView>

        <AuthOptions visible={showSheet} onClose={closeAuthOptions} onSuccess={handleAuthSuccess} />
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  container: { alignItems: 'center', paddingHorizontal: 24 },
  title: {
    color: COLORS.cyan,
    fontFamily: FONTS.title,
    fontSize: SIZES.h1,
    marginTop: 16,
    marginBottom: 32,
  },
  buttons: { width: '100%', alignItems: 'center' },
  primaryButton: {
    backgroundColor: COLORS.cyan,
    width: '80%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: COLORS.black,
    // fontFamily: FONTS.title,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: '#2C2C2E',
    width: '80%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#C7C7CC',
    fontFamily: FONTS.body,
    fontSize: 14,
  },
});
