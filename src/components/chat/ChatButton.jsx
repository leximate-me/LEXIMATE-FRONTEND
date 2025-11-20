import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications'; // We might want a separate hook for unread chat messages later

const ChatButton = ({ onClick, isOpen }) => {
  // TODO: Add unread messages count specifically for chat if available
  
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 z-50 ${
        isOpen 
          ? 'bg-red-500 hover:bg-red-600 rotate-90' 
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
      aria-label="Abrir chat"
    >
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <MessageCircle className="h-8 w-8 text-white" />
      )}
    </button>
  );
};

export default ChatButton;
