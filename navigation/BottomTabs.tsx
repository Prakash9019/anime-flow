// navigation/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import Profile from '../screens/Profile';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator();

export default function UserTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: COLORS.black },
      tabBarActiveTintColor: COLORS.cyan,
      tabBarInactiveTintColor: '#888'
    }}>
      <Tab.Screen name="Home" component={HomeStack}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size}/> }}
      />
      <Tab.Screen name="Profile" component={Profile}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size}/> }}
      />
    </Tab.Navigator>
  );
}
