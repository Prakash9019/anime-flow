// components/HeaderBack.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../theme';

interface HeaderBackProps {
  title: string;
  onBack: () => void;
}

export default function HeaderBack({ title, onBack }: HeaderBackProps): React.ReactElement {
  return (
    <View style={styles.wrap}>
      <TouchableOpacity 
        onPress={onBack} 
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-back" color={COLORS.text} size={24} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <Ionicons name="share-outline" color={COLORS.text} size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 12, 
    paddingHorizontal: 16, 
    paddingBottom: 8,
    backgroundColor: '#000', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between'
  },
  title: { 
    color: COLORS.text, 
    fontSize: SIZES.h2, 
    fontFamily: FONTS.title, 
    letterSpacing: 0.5 
  }
});
