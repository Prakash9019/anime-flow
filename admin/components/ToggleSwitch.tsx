// components/ToggleSwitch.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function ToggleSwitch({ label, value, onValueChange }: ToggleSwitchProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.toggle, value && styles.toggleActive]}
        onPress={() => onValueChange(!value)}
      >
        <View style={[styles.thumb, value && styles.thumbActive]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
  },
  toggle: {
    width: 50,
    height: 28,
    backgroundColor: '#555',
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: COLORS.cyan,
  },
  thumb: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.text,
    borderRadius: 12,
  },
  thumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.black,
  },
});
