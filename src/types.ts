// src/types.ts
export interface ChatbotConfig {
    siteId: string;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    primaryColor?: string;
    title?: string;
  }
  
  export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }
  