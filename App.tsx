// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
// import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from './screens/Splash';
import Auth from './screens/Auth';
import BottomTabs from './navigation/BottomTabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.ReactElement {
  const [loaded] = useFonts({
    JapanRamen: require('./assets/fonts/JAPAN RAMEN.otf')
  });
  
  // if (!loaded) return <AppLoading />;

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Auth" component={Auth} />
          <Stack.Screen name="Main" component={BottomTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
