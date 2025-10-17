// // services/api.ts
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const API = 'https://anime-backend-817384216349.asia-south1.run.app/api';

// class ApiService {
//   token: string | null = null;

//   async init() {
//     this.token = await AsyncStorage.getItem('token');
//   }

//   private async authHeaders(): Promise<Record<string, string>> {
//     const token = this.token || (await AsyncStorage.getItem('token'));
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   }

//   // Auth
//   async login(email: string, password: string) {
//     const res = await fetch(`${API}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });
//     const data = await res.json();
//     if (res.ok) {
//       await AsyncStorage.setItem('token', data.token);
//       this.token = data.token;
//       await AsyncStorage.setItem('user', JSON.stringify(data.user));
//     }
//     return data;
//   }

//   async googleAuth(body: any) {
//     const res = await fetch(`${API}/auth/google`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     });
//     const data = await res.json();
//     if (res.ok) {
//       await AsyncStorage.setItem('token', data.token);
//       this.token = data.token;
//       await AsyncStorage.setItem('user', JSON.stringify(data.user));
//     }
//     return data;
//   }

//   // Anime list
//   async getAnimeList() {
//     const res = await fetch(`${API}/anime`);
//     return res.json();
//   }
//   async getAnimeById(id: string) {
//     const res = await fetch(`${API}/anime/${id}`);
//     return res.json();
//   }

//   // Ratings
//   async rateEpisode(episodeId: string, rating: number) {
//     const headers = {
//       'Content-Type': 'application/json',
//       ...(await this.authHeaders()),
//     } as HeadersInit;
//     const res = await fetch(`${API}/anime/rate-episode`, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify({ episodeId, rating }),
//     });
//     return res.json();
//   }

//   // Admin
//   async postAnime(data: any) {
//     const headers = {
//       'Content-Type': 'application/json',
//       ...(await this.authHeaders()),
//     } as HeadersInit;
//     const res = await fetch(`${API}/admin/anime`, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify(data),
//     });
//     return res.json();
//   }
//   async updateAnime(id: string, data: any) {
//     const headers = {
//       'Content-Type': 'application/json',
//       ...(await this.authHeaders()),
//     } as HeadersInit;
//     const res = await fetch(`${API}/admin/anime/${id}`, {
//       method: 'PUT',
//       headers,
//       body: JSON.stringify(data),
//     });
//     return res.json();
//   }
//   async bulkUpload(file: any) {
//     const form = new FormData();
//     form.append('file', file);
//     const headers = await this.authHeaders();
//     const res = await fetch(`${API}/admin/bulk-upload`, {
//       method: 'POST',
//       headers,
//       body: form,
//     });
//     return res.json();
//   }
// }

// export default new ApiService();

// services/api.ts
// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://anime-backend-817384216349.asia-south1.run.app/api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
}

class ApiService {
  private token: string | null = null;
  public baseURL = API_BASE_URL; // Make baseURL public

  async init() {
    this.token = await AsyncStorage.getItem('token');
    // console.log(this.token)
  }

  // Make getAuthHeaders public
// services/api.ts
public async getAuthHeaders(): Promise<Record<string,string>> {
  const adminToken = await AsyncStorage.getItem('adminToken');
  const userToken  = await AsyncStorage.getItem('token');
  const token = adminToken || userToken;
  console.log('Using auth token:', token);
  if (!token) return {};
  return { 'X-User-Auth': `Bearer ${token}` };
}

  // Auth methods
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

 // services/api.ts (add or update this method)
async googleAuth(googleData: { googleId: string; name: string; email: string; avatar: string | null }) {
  try {
    const response = await fetch(`${this.baseURL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleData),
    });

    const data = await response.json();
    
    if (response.ok && data.token) {
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user, token: data.token };
    }
    
    return { success: false, message: data.message || 'Authentication failed' };
  } catch (error) {
    console.error('API googleAuth error:', error);
    return { success: false, message: 'Network error' };
  }
}


  async logout() {
    this.token = null;
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  }

  // Anime methods
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
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(await this.getAuthHeaders()),
    };
    
    const response = await fetch(`${API_BASE_URL}/anime/rate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ animeId, rating, review }),
    });
    return response.json();
  }

  async rateEpisode(episodeId: string, rating: number) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(await this.getAuthHeaders()),
    };
    
    const response = await fetch(`${API_BASE_URL}/anime/rate-episode`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ episodeId, rating }),
    });
    return response.json();
  }

  // Admin methods
  async createAnime(animeData: any) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(await this.getAuthHeaders()),
    };
    
    const response = await fetch(`${API_BASE_URL}/admin/anime`, {
      method: 'POST',
      headers,
      body: JSON.stringify(animeData),
    });
    return response.json();
  }

  async updateAnime(id: string, animeData: any) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(await this.getAuthHeaders()),
    };
    
    const response = await fetch(`${API_BASE_URL}/admin/anime/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(animeData),
    });
    return response.json();
  }

  async bulkUpload(file: any) {
    const formData = new FormData();
    formData.append('file', file);

    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/admin/bulk-upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return response.json();
  }
}

export default new ApiService();
