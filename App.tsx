// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
// import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import { StripeProvider } from '@stripe/stripe-react-native';
import AdminLogin from './admin/screens/AdminLogin';
import AdminStack from './admin/navigation/AdminStack';
import UserAuth from './screens/Auth';
import UserTabs from './navigation/BottomTabs';
const isProduction = process.env.NODE_ENV === 'production';

const publishableKey = isProduction ? 'pk_live_...' : 'pk_test_...'; // Your Test Key


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

<StripeProvider publishableKey={publishableKey}>
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
      </StripeProvider>
    </>
  );
}
