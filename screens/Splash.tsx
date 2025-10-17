import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS, SIZES } from '../theme';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SplashNavProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function Splash(): React.ReactElement {
  const navigation = useNavigation<SplashNavProp>();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Wait for minimum splash duration
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check for user token
      const userToken = await AsyncStorage.getItem('userToken');
      const adminToken = await AsyncStorage.getItem('adminToken');

      if (adminToken) {
        // Admin is logged in
        navigation.replace('AdminMain');
      } else if (userToken) {
        // User is logged in
        navigation.replace('UserMain');
      } else {
        // Not logged in
        navigation.replace('UserAuth');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // On error, go to auth screen
      navigation.replace('UserAuth');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/images/logo.jpg')}
          style={styles.logo}
        />
        <Text style={styles.title}>ANIME FLOW</Text>
        <Text style={styles.subtitle}>Your Ultimate Anime Experience</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    color: COLORS.cyan,
    fontSize: SIZES.h2,
    fontFamily: FONTS.title,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.text,
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    textAlign: 'center',
  },
});
