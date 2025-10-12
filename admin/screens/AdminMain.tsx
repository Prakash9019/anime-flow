// admin/screens/AdminMain.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../../theme';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';
import ApiService from '../../services/api';
import { AdminParamList } from '../navigation/AdminStack';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
type AdminNavProp = NativeStackNavigationProp<AdminParamList, 'AdminPanel'>;

interface AdminUser {
  email: string;
  name: string;
  isAdmin: boolean;
}

type ViewMode = 'Dashboard' | 'Admin Panel';

export default function AdminMain(): React.ReactElement {
  const navigation = useNavigation<AdminNavProp>();
  const [currentView, setCurrentView] = useState<ViewMode>('Dashboard');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const adminData = await AsyncStorage.getItem('adminUser');
      if (adminData) {
        setAdminUser(JSON.parse(adminData));
      } else {
        // No admin session, redirect to login
        navigation.replace('AdminLogin');
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      navigation.replace('AdminLogin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from admin mode?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('adminToken');
            await AsyncStorage.removeItem('adminUser');
            navigation.replace('AdminLogin');
          }
        }
      ]
    );
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const selectView = (view: ViewMode) => {
    setCurrentView(view);
    setDropdownVisible(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={COLORS.cyan} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.jpg')}
          style={styles.logo}
        />
        
        {/* Dropdown Selector */}
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={toggleDropdown}
        >
          <Text style={styles.dropdownText}>{currentView}</Text>
          <Ionicons 
            name={dropdownVisible ? "chevron-up" : "chevron-down"} 
            color={COLORS.text} 
            size={20} 
          />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" color={COLORS.text} size={24} />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity 
            style={[
              styles.dropdownItem,
              currentView === 'Dashboard' && styles.activeDropdownItem
            ]}
            onPress={() => selectView('Dashboard')}
          >
            <Ionicons name="analytics" color={COLORS.cyan} size={20} />
            <Text style={styles.dropdownItemText}>Dashboard</Text>
            {currentView === 'Dashboard' && (
              <Ionicons name="checkmark" color={COLORS.cyan} size={20} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.dropdownItem,
              currentView === 'Admin Panel' && styles.activeDropdownItem
            ]}
            onPress={() => selectView('Admin Panel')}
          >
            <Ionicons name="settings" color={COLORS.cyan} size={20} />
            <Text style={styles.dropdownItemText}>Admin Panel</Text>
            {currentView === 'Admin Panel' && (
              <Ionicons name="checkmark" color={COLORS.cyan} size={20} />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {currentView === 'Dashboard' ? (
          <Dashboard adminUser={adminUser} />
        ) : (
          <AdminPanel />
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>ANIME FLOW ADMIN MODE</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logo: {
    width: 40,
    height: 40,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 150,
    justifyContent: 'center',
  },
  dropdownText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.title,
    marginRight: 8,
  },
  logoutButton: {
    padding: 8,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 80,
    left: '50%',
    transform: [{ translateX: -75 }],
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 150,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activeDropdownItem: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
  },
  dropdownItemText: {
    color: COLORS.text,
    fontSize: 14,
    fontFamily: FONTS.body,
    marginLeft: 12,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerLine: {
    width: 80,
    height: 4,
    backgroundColor: COLORS.cyan,
    marginBottom: 8,
  },
  footerText: {
    color: COLORS.cyan,
    fontSize: 14,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
});
