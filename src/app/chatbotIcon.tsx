'use client'

import React from 'react';
import { FaRobot } from 'react-icons/fa'; 

type ChatbotIconProps = {
  onClick: () => void; 
};

const ChatbotIcon: React.FC<ChatbotIconProps> = ({ onClick }) => {
  return (
    <div className="chatbot-icon" onClick={onClick}>
      <FaRobot size={30} />
      <style jsx>{`
        .chatbot-icon {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #5a67d8; /* Your theme color */
          border-radius: 50%;
          padding: 10px;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          z-index: 1000; /* Ensure it's above other elements */
        }
      `}</style>
    </div>
  );
};

export default ChatbotIcon;
