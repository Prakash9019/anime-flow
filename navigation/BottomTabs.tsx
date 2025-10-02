// navigation/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { MainTabParamList } from '../types';
import HomeStack from './HomeStack';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function BottomTabs(): React.ReactElement {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.black, borderTopColor: '#111' },
        tabBarActiveTintColor: COLORS.cyan,
        tabBarInactiveTintColor: '#9EA0A3',
        tabBarLabelStyle: { fontSize: 12 }
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{ 
          title: 'Home', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  );
}
