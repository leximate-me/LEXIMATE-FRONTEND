import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { chatService } from '../../api/chat';
import ChatList from './ChatList';
import ChatInterface from './ChatInterface';
import ChatButton from './ChatButton';
import { X } from 'lucide-react';

const ChatWindow = () => {
  const { user } = useAuth();
  const { isOpen, toggleChat, activeChat, setActiveChat, closeChat } = useChat();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch chats when window opens
  useEffect(() => {
    if (isOpen && !activeChat) {
      fetchChats();
    }
  }, [isOpen, activeChat]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const data = await chatService.getUserChats();
      
      console.log('📦 Raw chat data from backend:', JSON.stringify(data, null, 2));
      
      // Process chats to identify other user
      const processedChats = data.map(chat => {
        console.log('🔍 Processing chat:', chat.id, 'Users:', chat.users);
        
        // The backend returns 'users', but we might have 'participants' in some contexts
        const participants = chat.users || chat.participants || [];
        const other = participants.find(p => p.id !== user.id);
        
        if (!other) {
          console.warn('No other user found in chat:', chat.id);
          return {
            ...chat,
            otherUser: {
              id: null,
              name: 'Usuario Desconocido',
              avatar: null
            }
          };
        }
        
        // Extract name from people object
        const firstName = other.people?.first_name || other.first_name || '';
        const lastName = other.people?.last_name || other.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Usuario Desconocido';
        
        // Extract avatar from userFiles array
        const avatar = other.userFiles?.[0]?.file_url || other.avatar?.file_url || null;
        
        return {
          ...chat,
          otherUser: {
            id: other.id,
            name: fullName,
            avatar: avatar
          }
        };
      });
      
      setChats(processedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  const handleBackToList = () => {
    setActiveChat(null);
    fetchChats(); // Refresh list to update last messages
  };

  if (!user) return null;

  return (
    <>
      <ChatButton onClick={toggleChat} isOpen={isOpen} />

      {/* Chat Window Container */}
      <div
        className={`fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 transform z-40 ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
        }`}
      >
        {/* Header (only shown in list view) */}
        {!activeChat && (
          <div className="px-4 py-3 bg-blue-600 text-white flex justify-between items-center">
            <h2 className="font-bold text-lg">Mensajes</h2>
            <button 
              onClick={closeChat}
              className="p-1 hover:bg-blue-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {activeChat ? (
            <ChatInterface 
              chat={activeChat} 
              onBack={handleBackToList} 
            />
          ) : (
            <ChatList 
              chats={chats} 
              activeChat={activeChat} 
              onSelectChat={handleSelectChat} 
              loading={loading}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
