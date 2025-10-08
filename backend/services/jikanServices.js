// backend/services/jikanService.js (NEW FILE)
const axios = require('axios');

class JikanService {
  constructor() {
    this.baseURL = 'https://api.jikan.moe/v4';
  }

  // Get anime episodes from Jikan
  async getAnimeEpisodes(malId) {
    try {
      const response = await axios.get(`${this.baseURL}/anime/${malId}/episodes`);
      return response.data.data || [];
    } catch (error) {
      console.error('Jikan episodes error:', error);
      return [];
    }
  }

  // Get anime details with more complete data
  async getAnimeDetails(malId) {
    try {
      const response = await axios.get(`${this.baseURL}/anime/${malId}`);
      return response.data.data;
    } catch (error) {
      console.error('Jikan details error:', error);
      return null;
    }
  }
}

module.exports = new JikanService();
