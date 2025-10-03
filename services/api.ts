// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.100:5000/api'; // Replace with your IP

class ApiService {
  private token: string | null = null;

  async init() {
    this.token = await AsyncStorage.getItem('token');
  }

  private async getAuthHeaders() {
    const token = this.token || await AsyncStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Auth
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    
    if (response.ok) {
      this.token = data.token;
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  }

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    
    if (response.ok) {
      this.token = data.token;
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  }

  async googleAuth(googleData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleData),
    });
    const data = await response.json();
    
    if (response.ok) {
      this.token = data.token;
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  }

  // Anime
  async getAnimeList(params?: any) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await fetch(`${API_BASE_URL}/anime${queryString}`);
    return response.json();
  }

  async getAnimeById(id: string) {
    const response = await fetch(`${API_BASE_URL}/anime/${id}`);
    return response.json();
  }

  async rateAnime(animeId: string, rating: number, review?: string) {
    const response = await fetch(`${API_BASE_URL}/anime/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await this.getAuthHeaders()),
      },
      body: JSON.stringify({ animeId, rating, review }),
    });
    return response.json();
  }

  async rateEpisode(episodeId: string, rating: number) {
    const response = await fetch(`${API_BASE_URL}/anime/rate-episode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await this.getAuthHeaders()),
      },
      body: JSON.stringify({ episodeId, rating }),
    });
    return response.json();
  }

  // Admin
  async createAnime(animeData: any) {
    const response = await fetch(`${API_BASE_URL}/admin/anime`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await this.getAuthHeaders()),
      },
      body: JSON.stringify(animeData),
    });
    return response.json();
  }

  async updateAnime(id: string, animeData: any) {
    const response = await fetch(`${API_BASE_URL}/admin/anime/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(await this.getAuthHeaders()),
      },
      body: JSON.stringify(animeData),
    });
    return response.json();
  }

  async addEpisode(animeId: string, episodeData: any) {
    const response = await fetch(`${API_BASE_URL}/admin/anime/${animeId}/episodes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await this.getAuthHeaders()),
      },
      body: JSON.stringify(episodeData),
    });
    return response.json();
  }

  async bulkUpload(file: any) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/admin/bulk-upload`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: formData,
    });
    return response.json();
  }

  async logout() {
    this.token = null;
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  }
}

export default new ApiService();
