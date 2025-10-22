// navigation/BottomTabs.tsx
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import HomeStack from './HomeStack';
import Profile from '../screens/Profile';
import DonationModal from '../components/DonationModal';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator();

// Empty component for Donate tab
const EmptyComponent = () => <View style={{ flex: 1, backgroundColor: COLORS.black }} />;

export default function UserTabs() {
  const [showDonationModal, setShowDonationModal] = useState(false);

  const handleDonationSuccess = () => {
    setShowDonationModal(false);
  };

  return (
    <>
      <Tab.Navigator 
        screenOptions={{
          headerShown: false,
          tabBarStyle: { 
            backgroundColor: COLORS.black,
            borderTopWidth: 1,
            // borderTopColor: '#333',
            // height: 60,
            // paddingBottom: 8,
            // paddingTop: 8,
          },
          tabBarActiveTintColor: COLORS.cyan,
          tabBarInactiveTintColor: '#888',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{ 
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        
        <Tab.Screen 
          name="Donate" 
          component={EmptyComponent}
          listeners={{
            tabPress: (e) => {
              // Prevent default navigation
              e.preventDefault();
              // Show donation modal instead
              setShowDonationModal(true);
            },
          }}
          options={{ 
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" color={color} size={size} />
            ),
          }}
         
        />
        
        <Tab.Screen 
          name="Profile" 
          component={Profile}
          options={{ 
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>

      {/* Donation Modal */}
      <DonationModal
        visible={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onSuccess={handleDonationSuccess}
      />
    </>
  );
}

const styles = StyleSheet.create({
  donateButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
  },
  donateButtonActive: {
    backgroundColor: COLORS.cyan,
  },
});
