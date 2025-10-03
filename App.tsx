// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
// import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';

import AdminLogin from './admin/screens/AdminLogin';
import AdminStack from './admin/navigation/AdminStack';
import UserAuth from './screens/Auth';
import UserTabs from './navigation/BottomTabs';

type RootStackParamList = {
  UserAuth: undefined;
  UserMain: undefined;
  AdminLogin: undefined;
  AdminMain: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [loaded] = useFonts({ JapanRamen: require('./assets/fonts/JAPAN RAMEN.otf') });
  // if (!loaded) return <AppLoading />;

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* User flow */}
          <Stack.Screen name="UserAuth" component={UserAuth} />
          <Stack.Screen name="UserMain" component={UserTabs} />

          {/* Admin flow */}
          <Stack.Screen name="AdminLogin" component={AdminLogin} />
          <Stack.Screen name="AdminMain" component={AdminStack} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
