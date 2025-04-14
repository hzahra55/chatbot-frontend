// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = {
  sendMessage: async (siteId: string, message: string) => {
    try {
      const response = await axios.post(`${API_URL}/chat`, {
        siteId,
        message
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};

export default api;
