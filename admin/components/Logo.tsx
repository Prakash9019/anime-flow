// admin/components/Logo.tsx
import React from 'react';
import { Image, View, StyleSheet, ImageStyle, ViewStyle } from 'react-native';
import { COLORS } from '../../theme';

interface LogoProps {
  size?: number;
  tint?: string;
}

export default function Logo({ size = 60, tint = COLORS.cyan }: LogoProps) {
  return (
    <View style={[styles.container, { width: size + 16, height: size + 16 }]}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={[styles.image, { width: size, height: size, tintColor: tint }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  image: {
    resizeMode: 'contain',
  } as ImageStyle,
});
