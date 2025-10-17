import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS, SIZES } from '../theme';
import { RootStackParamList } from '../types';

type SplashNavProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function Splash(): React.ReactElement {
  const navigation = useNavigation<SplashNavProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Auth'); // Now works: replace exists!
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

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
