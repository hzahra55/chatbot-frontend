import React from 'react';
import { Message } from '../types';

interface Props {
  message: Message;
  primaryColor: string;
}

const MessageBubble: React.FC<Props> = ({ message, primaryColor }) => {
  const isUser = message.sender === 'user';

  return (
    <div
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        backgroundColor: isUser ? primaryColor : '#f0f0f0',
        color: isUser ? 'white' : 'black',
        padding: '10px 15px',
        borderRadius: '18px',
        margin: '5px 0',
        maxWidth: '70%',
        wordBreak: 'break-word',
      }}
    >
      {message.text}
    </div>
  );
};

export default MessageBubble;
