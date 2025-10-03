// hooks/useApi.ts
import { useState, useEffect } from 'react';
import ApiService from './services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    await ApiService.init();
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await ApiService.login(email, password);
      if (data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await ApiService.register(name, email, password);
      if (data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const logout = async () => {
    await ApiService.logout();
    setUser(null);
  };

  return { user, loading, login, register, logout };
};

export const useAnime = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAnimeList = async (params?: any) => {
    setLoading(true);
    try {
      const data = await ApiService.getAnimeList(params);
      setAnimeList(data.anime);
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
    }
  };

  const rateAnime = async (animeId: string, rating: number) => {
    return ApiService.rateAnime(animeId, rating);
  };

  const rateEpisode = async (episodeId: string, rating: number) => {
    return ApiService.rateEpisode(episodeId, rating);
  };

  return { animeList, loading, fetchAnimeList, rateAnime, rateEpisode };
};
