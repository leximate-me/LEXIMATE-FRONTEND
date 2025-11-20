import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { User } from 'lucide-react';

const ChatList = ({ chats, activeChat, onSelectChat, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p>Cargando chats...</p>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
        <MessageCircle className="w-12 h-12 mb-2 opacity-20" />
        <p>No tienes conversaciones activas.</p>
        <p className="text-xs mt-2">Busca un profesor o compañero para chatear.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => {
        // Find the other participant (not the current user)
        // Note: This logic assumes we have the current user ID available or passed down
        // For now, we'll assume the chat object has a 'participants' array and we display the name of the first one that isn't "me"
        // Or better, the backend usually returns a 'name' or 'avatar' for the chat or we process it in the parent.
        // Let's assume the parent processes 'chat.otherUser' for easier display.
        
        const otherUser = chat.otherUser || { name: 'Usuario', avatar: null };
        const lastMessage = chat.lastMessage;
        const isActive = activeChat?.id === chat.id;

        return (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="relative flex-shrink-0">
              {otherUser.avatar ? (
                <img
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                </div>
              )}
              {/* Online status indicator could go here */}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {otherUser.name}
                </h3>
                {lastMessage && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                    {formatDistanceToNow(new Date(lastMessage.createdAt), {
                      addSuffix: false,
                      locale: es,
                    })}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {lastMessage ? lastMessage.content : 'Iniciar conversación'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

import { MessageCircle } from 'lucide-react';

export default ChatList;
