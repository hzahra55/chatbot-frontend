import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { ChatbotConfig, Message } from '../types';
import api from '../services/api';

interface ChatbotProps {
  config: ChatbotConfig;
}

const Chatbot: React.FC<ChatbotProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const primaryColor = config.primaryColor || '#4a69bd';
  const position = config.position || 'bottom-right';
  const title = config.title || 'Chat with us';
  
  // Load messages on mount
  useEffect(() => {
    const storedMessages = localStorage.getItem(`chat_${config.siteId}`);
    
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      // Add a welcome message
      const welcomeMessage: Message = {
        id: '1',
        text: 'Hi! How can I help you today?',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [config.siteId]);
  
  // Save messages when they change
  useEffect(() => {
    localStorage.setItem(`chat_${config.siteId}`, JSON.stringify(messages));
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, config.siteId]);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Create a new user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add the user message to the chat
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Call the API
      const response = await api.sendMessage(config.siteId, userMessage.text);
      
      // Add the bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response || "I'm sorry, I couldn't process your request.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      // Add an error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get position style based on config
  const getPositionStyle = () => {
    const style: React.CSSProperties = {};
    
    if (position.includes('bottom')) {
      style.bottom = '20px';
    } else {
      style.top = '20px';
    }
    
    if (position.includes('right')) {
      style.right = '20px';
    } else {
      style.left = '20px';
    }
    
    return style;
  };
  
  // Styles
  const chatButtonStyle: React.CSSProperties = {
    position: 'fixed',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: primaryColor,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    border: 'none',
    zIndex: 9999,
    ...getPositionStyle()
  };
  
  const chatContainerStyle: React.CSSProperties = {
    position: 'fixed',
    width: '350px',
    height: '500px',
    display: isOpen ? 'flex' : 'none',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 5px 40px rgba(0,0,0,0.16)',
    overflow: 'hidden',
    zIndex: 9999,
    ...getPositionStyle()
  };
  
  const headerStyle: React.CSSProperties = {
    backgroundColor: primaryColor,
    color: 'white',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold'
  };
  
  const closeButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  
  const messageListStyle: React.CSSProperties = {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  };
  
  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #e6e6e6'
  };
  
  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px',
    border: '1px solid #e6e6e6',
    borderRadius: '20px',
    outline: 'none',
    fontSize: '14px'
  };
  
  const sendButtonStyle: React.CSSProperties = {
    background: primaryColor,
    color: 'white',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    marginLeft: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  };
  
  return (
    <>
      {/* Chat toggle button */}
      <button 
        style={chatButtonStyle} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
      </button>
      
      {/* Chat container */}
      <div style={chatContainerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>{title}</div>
          <button 
            style={closeButtonStyle} 
            onClick={() => setIsOpen(false)}
          >
            <FiX />
          </button>
        </div>
        
        {/* Message list */}
        <div style={messageListStyle}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: message.sender === 'user' ? primaryColor : '#f0f0f0',
                color: message.sender === 'user' ? 'white' : 'black',
                padding: '10px 15px',
                borderRadius: '18px',
                margin: '5px 0',
                maxWidth: '70%',
                wordBreak: 'break-word'
              }}
            >
              {message.text}
            </div>
          ))}
          
          {isLoading && (
            <div
              style={{
                alignSelf: 'flex-start',
                backgroundColor: '#f0f0f0',
                color: 'black',
                padding: '10px 15px',
                borderRadius: '18px',
                margin: '5px 0',
                maxWidth: '70%'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  backgroundColor: '#555', 
                  borderRadius: '50%',
                  opacity: 0.3,
                  animation: 'typingAnimation 1s infinite ease-in-out',
                  animationDelay: '0s'
                }}></div>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  backgroundColor: '#555', 
                  borderRadius: '50%',
                  opacity: 0.3,
                  animation: 'typingAnimation 1s infinite ease-in-out',
                  animationDelay: '0.2s'
                }}></div>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  backgroundColor: '#555', 
                  borderRadius: '50%',
                  opacity: 0.3,
                  animation: 'typingAnimation 1s infinite ease-in-out',
                  animationDelay: '0.4s'
                }}></div>
              </div>
            </div>
          )}
          
          {/* This div helps us scroll to the bottom */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div style={inputContainerStyle}>
          <input
            type="text"
            style={inputStyle}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button 
            style={sendButtonStyle}
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>
      
      {/* CSS for typing animation */}
      <style>
        {`
          @keyframes typingAnimation {
            0% { opacity: 0.3; transform: translateY(0px); }
            50% { opacity: 1; transform: translateY(-5px); }
            100% { opacity: 0.3; transform: translateY(0px); }
          }
        `}
      </style>
    </>
  );
};

export default Chatbot;
