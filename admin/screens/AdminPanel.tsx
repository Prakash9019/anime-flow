// screens/AdminPanel.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import { COLORS, FONTS } from '../../theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AdminParamList } from '../navigation/AdminStack';

type AdminNavProp = NativeStackNavigationProp<AdminParamList, 'AdminPanel'>;

interface MenuItemProps {
  title: string;
  screen: keyof AdminParamList;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, screen }) => {
  const navigation = useNavigation<AdminNavProp>();
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => navigation.navigate(screen)}
    >
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons name="chevron-forward" color={COLORS.text} size={20} />
    </TouchableOpacity>
  );
};

export default function AdminPanel(): React.ReactElement {
  const menuItems: MenuItemProps[] = [
    { title: 'Post Anime Content', screen: 'PostAnimeContent' },
    { title: 'Edit Existing Anime Content', screen: 'EditContent' },
    { title: 'Bulk Upload', screen: 'BulkUpload' },
    { title: 'Bulk Edit', screen: 'BulkEdit' },
    { title: 'Manage Account', screen: 'ManageAccount' },
    { title: 'Create Employees', screen: 'CreateEmployee' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Logo size={60} />
      </View>

      <View style={styles.dropdown}>
        <Text style={styles.dropdownText}>Admin Panel</Text>
        <Ionicons name="chevron-down" color="#999" size={20} />
      </View>

      <ScrollView style={styles.menu}>
        {menuItems.map((item, idx) => (
          <MenuItem key={idx} title={item.title} screen={item.screen} />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>ANIME FLOW ADMIN MODE</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: { alignItems: 'center', paddingVertical: 20 },
  dropdown: {
    backgroundColor: '#222',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dropdownText: { color: COLORS.text, fontSize: 16, fontFamily: FONTS.body },
  menu: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
  menuItem: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  menuText: { color: COLORS.text, fontSize: 16, fontFamily: FONTS.body },
  footer: { alignItems: 'center', paddingVertical: 20 },
  footerLine: { width: 80, height: 4, backgroundColor: COLORS.cyan, marginBottom: 12 },
  footerText: { color: COLORS.cyan, fontSize: 14, fontFamily: FONTS.title }
});
