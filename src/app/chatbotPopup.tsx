'use client'

import React, { useState } from 'react';

const ChatbotPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([{ text: 'Hello! How can I help you today?', sender: 'ai' }]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      // Reverse the order of messages when updating the state
      setMessages([{ text: userInput, sender: 'user' }, ...messages]);
      setUserInput('');
    }
  };

  return (
    <div className="chatbot-popup">
      <style jsx>{`
        .chatbot-popup {
          position: fixed;
          bottom: 100px;
          right: 20px;
          width: auto;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          padding: 20px;
          z-index: 1001;
          display: flex;
          flex-direction: column;
        }

        .chatbot-header {
          color: black;
          font-size: 1.2em;
          text-align: center;
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
          margin-bottom: 10px;
        }

        .chatbot-messages {
          color: black;
          display: flex;
          flex-direction: column-reverse; 
          overflow-y: auto;
        }

        .message {
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 20px;
          max-width: 80%;
        }

        .ai-message {
          background-color: #5a67d8;
          color: white;
          align-self: flex-start;
        }

        .user-message {
          background-color: #ddd;
          color: black;
          align-self: flex-end;
        }

        .chatbot-input {
          display: flex;
          gap: 10px;
          padding-top: 10px;
        }

        .chatbot-input input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .chatbot-input button {
          padding: 8px 15px;
          background-color: #5a67d8;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
        }

        .chatbot-close-icon {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 24px;
          cursor: pointer;
          color: #bbb;
        }

        .chatbot-close-icon:hover {
          color: #999;
        }

        @media (max-width: 400px) {
          .chatbot-popup {
            width: 95%;
            right: 2.5%;
            bottom: 50px;
          }
        }
      `}</style>
      <div className="chatbot-header">Chat with us</div>
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'ai' ? 'ai-message' : 'user-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <span className="chatbot-close-icon" onClick={onClose}>✖</span>
    </div>
  );
};

export default ChatbotPopup;
