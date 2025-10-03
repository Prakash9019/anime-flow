// components/AdminHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Logo from './Logo';
import { COLORS, FONTS } from '../../theme';

interface AdminHeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function AdminHeader({ title, showBack }: AdminHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" color={COLORS.text} size={24} />
          </TouchableOpacity>
        ) : (
          <Logo size={50} />
        )}
        
        {title && <Text style={styles.title}>{title}</Text>}
        
        {!showBack && (
          <TouchableOpacity>
            <Ionicons name="share-outline" color={COLORS.text} size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontFamily: FONTS.title,
    flex: 1,
    textAlign: 'center',
  },
});
