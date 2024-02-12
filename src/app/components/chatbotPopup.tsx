'use client'

import React, { useState } from 'react';

const ChatbotPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([{ content: 'Hello! How can I help you today?', role: 'assistant' }]);
  const [isAiTyping, setIsAiTyping] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      const userMessage = { role: "user", content: userInput };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setIsAiTyping(true);

      fetch(`/api/openai/chat`, {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [userMessage],
        })
      })
      .then((res) => res.json())
      .then(data => {
        setMessages((prevMessages) => [ ...prevMessages, data]);
        setIsAiTyping(false)
      })
      .catch((error) => {
        setIsAiTyping(false); // AI is no longer typing on error
        console.error("Error getting response from OpenAI:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "ai", content: "Sorry, I encountered an error." },
        ]);
        // setMessages((initial) => [{ content: userInput, role: 'user' }, ...initial]);
      })
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
          width: 400px;
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
          flex-direction: column; /* Updated to column */
          max-height: 400px;
          overflow-y: auto;
          padding-right: 10px;
          box-sizing: border-box;
        }

        .message {
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 20px;
          max-width: 100%;
          word-wrap: break-word; /* Break long words to the next line */
          overflow-wrap: break-word;
        }

        .ai-message {
          background-color: #e8e8e8; /* Light color for AI messages */
          color: black;
          align-self: flex-start; /* Align to the left */
          margin-right: auto; /* Push to the left side */
        }

        .user-message {
          background-color: #5a67d8; /* Darker color for user messages */
          color: white;
          align-self: flex-end; /* Align to the right */
          margin-left: auto; /* Push to the right side */
        }

        @keyframes blink {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .typing-dot {
          height: 10px;
          width: 10px;
          margin: 0 2px;
          background-color: #999;
          border-radius: 50%;
          display: inline-block;
          animation: blink 1.5s linear infinite;
        }

        /* Add styles for the typing indicator to align it with AI messages */
        .typing-indicator {
          display: flex;
          align-items: center;
          justify-content: flex-start; // Align the dots to the left
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

        /* Custom Scrollbar Styles */
        /* width */
        ::-webkit-scrollbar {
          width: 10px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
          background: #888; /* Light grey track */
          border-radius: 5px;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
          background: #000; /* Black handle */
          border-radius: 5px;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
          background: #555; /* Darker grey handle on hover */
        }
      `}</style>
      <div className="chatbot-header">Chat with us</div>
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
          key={index}
          className={`message ${message.role === 'assistant' ? 'ai-message' : 'user-message'}`}
          >
            {message.content}
          </div>
        ))}
        {isAiTyping && 
          <div
            className={`message ai-message`}
          >
            <span className="loading loading-dots loading-xs"></span>
          </div>
        }
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <span className="chatbot-close-icon" onClick={onClose}>✖</span>
    </div>
  );
};

export default ChatbotPopup;
