// components/FormInput.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: string;
  showReset?: boolean;
  dropdown?: boolean;
  options?: string[];
  onSelect?: (value: string) => void;
}

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  showReset,
  dropdown,
  options,
  onSelect
}: FormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {dropdown ? (
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>{value}</Text>
          <Text style={styles.chevron}>▾</Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#666"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType as any}
        />
      )}
      
      {showReset && (
        <TouchableOpacity style={styles.resetButton}>
          <Text style={styles.resetText}>Reset {label.includes('Password') ? 'Password' : 'Login Mail'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.cyan,
    fontSize: 16,
    marginBottom: 8,
    fontFamily: FONTS.body,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdownText: {
    color: COLORS.text,
  },
  chevron: {
    color: '#999',
  },
  resetButton: {
    marginTop: 8,
  },
  resetText: {
    color: COLORS.text,
    fontSize: 14,
  },
});
