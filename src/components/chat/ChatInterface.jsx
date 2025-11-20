import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MoreVertical } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { useRealTimeUpdates } from '../../hooks/useRealTimeUpdates';
import { chatService } from '../../api/chat';
import { useAuth } from '../../context/AuthContext';

const ChatInterface = ({ chat, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const otherUser = chat.otherUser || { name: 'Usuario' };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await chatService.getMessages(chat.id);
        setMessages(data);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chat.id]);

  // Listen for new messages
  useRealTimeUpdates('chat_message', (message) => {
    if (message.chatId === chat.id) {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    }
  });

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage.trim();
    setNewMessage(''); // Optimistic clear

    try {
      const sentMessage = await chatService.sendMessage(chat.id, content);
      // If the socket event comes back fast, we might get a duplicate if we append here too.
      // Usually better to wait for socket or append if we want optimistic UI.
      // For now, let's rely on the socket event or the response.
      // Let's append manually to be snappy, and handle dedup if needed (or rely on socket)
      // Actually, if we append here, and then socket comes, we get double.
      // A common pattern is to append optimistically with a temp ID, then replace.
      // For simplicity, let's just append the response since it's the confirmed message.
      
      // Check if message already added by socket (race condition)
      setMessages((prev) => {
        if (prev.some(m => m.id === sentMessage.id)) return prev;
        return [...prev, sentMessage];
      });
      
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      // TODO: Show error toast
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            {otherUser.avatar ? (
              <img 
                src={otherUser.avatar} 
                alt={otherUser.name} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm">
                {otherUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {otherUser.name}
              </h3>
              <span className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                En línea
              </span>
            </div>
          </div>
        </div>
        
        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                <p>No hay mensajes aún.</p>
                <p className="text-sm">¡Envía un saludo!</p>
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                isOwn={msg.senderId === user.id} 
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-full focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
