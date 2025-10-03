// hooks/useHardwareBack.ts
import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

/**
 * Call this from any screen component to enable hardware back button
 * to navigate.goBack() when focused.
 */
export function useHardwareBack() {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;  // We handled it
        }
        return false;   // Let OS handle it (exit app)
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );
}
