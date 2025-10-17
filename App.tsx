// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { StripeProvider } from '@stripe/stripe-react-native';
import { View, ActivityIndicator } from 'react-native';
import AdminLogin from './admin/screens/AdminLogin';
import AdminStack from './admin/navigation/AdminStack';
import UserAuth from './screens/Auth';
import UserTabs from './navigation/BottomTabs';
import { COLORS } from './theme';
// import AppLoading from 'expo-app-loading';
const isProduction = process.env.NODE_ENV === 'production';

const publishableKey = isProduction ? 'pk_live_51SGjE8BjlYTxejjmqLMF4SeL0W6s7LkOU7a0aqbFwquZ73gmJTHqKu82Vf4EeTZLJ8VAYKh9OII12rGFTpEIYZvk00nruMAiYz' : 'pk_live_51SGjE8BjlYTxejjmqLMF4SeL0W6s7LkOU7a0aqbFwquZ73gmJTHqKu82Vf4EeTZLJ8VAYKh9OII12rGFTpEIYZvk00nruMAiYz'; // Your Test Key


type RootStackParamList = {
  UserAuth: undefined;
  UserMain: undefined;
  AdminLogin: undefined;
  AdminMain: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
   const [fontsLoaded, fontError] = useFonts({
  JapanRamen: require('./assets/fonts/JapanRamen.otf'), // No spaces!
});
 if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.black }}>
        <ActivityIndicator size="large" color={COLORS.cyan} />
      </View>
    );
  }

  // Log font loading error
  if (fontError) {
    console.error('Font loading error:', fontError);
  }
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
