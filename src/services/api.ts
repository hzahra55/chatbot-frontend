// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// const api = {
//   sendMessage: async (siteId: string, message: string) => {
//     try {
//       const response = await axios.post(`${API_URL}/chat`, {
//         siteId,
//         message
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error sending message:', error);
//       throw error;
//     }
//   }
// };

// export default api;
export async function sendMessage(
    siteId: string,
    message: string,
    stepId: string,
    fromAI: boolean
  ): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/chat`, {
        siteId,
        message,
        stepId,
        fromAI
      });
  
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  
