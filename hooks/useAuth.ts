import { useState, useEffect } from 'react';
import ApiService from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    ApiService.init().then(async () => {
      const u = await AsyncStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await ApiService.login(email, pass);
    if (data.user) setUser(data.user);
    return data;
  };

  const googleLogin = async (body: any) => {
    const data = await ApiService.googleAuth(body);
    if (data.user) setUser(data.user);
    return data;
  };

  return { user, login, googleLogin };
}
