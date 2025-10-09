// components/Logo.tsx
import React from 'react';
import { Image, View, StyleSheet, ImageStyle, ViewStyle } from 'react-native';

interface LogoProps {
  size?: number;
  tint?: string;
  box?: boolean;
}

export default function Logo({ size = 84, tint = '#00FCEB', box = false }: LogoProps): React.ReactElement {
  if (box) {
    return (
      <View style={[styles.box, { width: size + 32, height: size + 20 }]}>
        <Image 
          source={require('../assets/images/logo.jpg')} 
          style={[styles.img, { width: size, height: size, tintColor: '#000' }]} 
        />
      </View>
    );
  }
  return (
    <Image 
      source={require('../assets/images/logo.jpg')} 
      style={[styles.img, { width: size, height: size }]} 
    />
  );
}

const styles = StyleSheet.create({
  img: {
    resizeMode: 'contain'
  } as ImageStyle,
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  } as ViewStyle
});
