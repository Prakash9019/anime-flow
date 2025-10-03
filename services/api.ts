// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'http://YOUR_BACKEND_IP:5000/api';

class ApiService {
  token: string | null = null;

  async init() {
    this.token = await AsyncStorage.getItem('token');
  }

  private async authHeaders(): Promise<Record<string, string>> {
    const token = this.token || (await AsyncStorage.getItem('token'));
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      await AsyncStorage.setItem('token', data.token);
      this.token = data.token;
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  }

  async googleAuth(body: any) {
    const res = await fetch(`${API}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      await AsyncStorage.setItem('token', data.token);
      this.token = data.token;
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  }

  // Anime list
  async getAnimeList() {
    const res = await fetch(`${API}/anime`);
    return res.json();
  }
  async getAnimeById(id: string) {
    const res = await fetch(`${API}/anime/${id}`);
    return res.json();
  }

  // Ratings
  async rateEpisode(episodeId: string, rating: number) {
    const headers = {
      'Content-Type': 'application/json',
      ...(await this.authHeaders()),
    } as HeadersInit;
    const res = await fetch(`${API}/anime/rate-episode`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ episodeId, rating }),
    });
    return res.json();
  }

  // Admin
  async postAnime(data: any) {
    const headers = {
      'Content-Type': 'application/json',
      ...(await this.authHeaders()),
    } as HeadersInit;
    const res = await fetch(`${API}/admin/anime`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return res.json();
  }
  async updateAnime(id: string, data: any) {
    const headers = {
      'Content-Type': 'application/json',
      ...(await this.authHeaders()),
    } as HeadersInit;
    const res = await fetch(`${API}/admin/anime/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return res.json();
  }
  async bulkUpload(file: any) {
    const form = new FormData();
    form.append('file', file);
    const headers = await this.authHeaders();
    const res = await fetch(`${API}/admin/bulk-upload`, {
      method: 'POST',
      headers,
      body: form,
    });
    return res.json();
  }
}

export default new ApiService();
