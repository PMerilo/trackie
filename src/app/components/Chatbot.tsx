'use client'

import ChatbotIcon from './chatbotIcon'
import { useState } from 'react'
import ChatbotPopup from './chatbotPopup'

export default function Chatbot() {
    const [isChatbotOpen, setIsChatbotOpen] = useState(false); 
    const handleChatbotClick = () => {
      setIsChatbotOpen(true); 
    };
    
    const handleCloseChatbot = () => {
      setIsChatbotOpen(false); 
    };
     
    return (
        <>
            <ChatbotIcon onClick={handleChatbotClick} />
            {isChatbotOpen && <ChatbotPopup onClose={handleCloseChatbot} />}
        </>
    )
}
