import React, { createContext, useContext, useState, useCallback } from 'react';
import { chatService } from '../api/chat';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const { user } = useAuth();
  
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const startChatWithUser = useCallback(async (userId) => {
    try {
      // Open the window first
      setIsOpen(true);
      
      // Check if chat already exists or create new one
      const chat = await chatService.createChat([userId]);
      
      // Process chat object to identify other user
      const participants = chat.users || chat.participants || [];
      const other = participants.find(p => p.id !== user.id);
      
      if (!other) {
        console.error('No other user found in created chat');
        setActiveChat({
          ...chat,
          participants,
          otherUser: {
            id: null,
            name: 'Usuario Desconocido',
            avatar: null
          }
        });
        return;
      }
      
      // Extract name from people object
      const firstName = other.people?.first_name || other.first_name || '';
      const lastName = other.people?.last_name || other.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim() || 'Usuario Desconocido';
      
      // Extract avatar from userFiles array
      const avatar = other.userFiles?.[0]?.file_url || other.avatar?.file_url || null;
      
      const processedChat = {
        ...chat,
        participants,
        otherUser: {
          id: other.id,
          name: fullName,
          avatar: avatar
        }
      };
      
      setActiveChat(processedChat);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  }, [user]);

  const value = {
    isOpen,
    activeChat,
    setActiveChat,
    toggleChat,
    openChat,
    closeChat,
    startChatWithUser
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
