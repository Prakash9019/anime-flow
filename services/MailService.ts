// services/MalService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimeNode, UserAnimeListResponse } from '../types/anime';

const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'YOUR_REDIRECT_URI';
const BASE = 'https://api.myanimelist.net/v2';

class MalService {
  token?: string;
  refresh?: string;

  async init() {
    this.token = await AsyncStorage.getItem('mal_token') || undefined;
    this.refresh = await AsyncStorage.getItem('mal_refresh') || undefined;
  }

  async authenticate(code: string) {
    const body = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    });
    const res = await fetch('https://myanimelist.net/v1/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const data = await res.json();
    this.token = data.access_token;
    this.refresh = data.refresh_token;
    await AsyncStorage.setItem('mal_token', data.access_token);
    await AsyncStorage.setItem('mal_refresh', data.refresh_token);
  }

  private async refreshToken() {
    if (!this.refresh) throw new Error('No refresh token');
    const body = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: this.refresh,
    });
    const res = await fetch('https://myanimelist.net/v1/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const data = await res.json();
    this.token = data.access_token;
    this.refresh = data.refresh_token;
    await AsyncStorage.setItem('mal_token', data.access_token);
    await AsyncStorage.setItem('mal_refresh', data.refresh_token);
  }

  // private async fetchWithAuth(url: string) {
  //   if (!this.token) throw new Error('Not authenticated');
  //   const res = await fetch(url, {
  //     headers: { Authorization: `Bearer ${this.token}` },
  //   });
  //   if (res.status === 401) {
  //     await this.refreshToken();
  //     return this.fetchWithAuth(url);
  //   }
  //   return res;
  // }

  // async getUserList(status?: string, limit = 100): Promise<AnimeNode[]> {
  //   let url = `${BASE}/users/@me/animelist?limit=${limit}&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_episodes,my_list_status`;
  //   if (status) url += `&status=${status}`;
  //   const res = await this.fetchWithAuth(url);
  //   const data: UserAnimeListResponse = await res.json();
  //   return data.data.map(item => item.node);
  // }
}

export default new MalService();
