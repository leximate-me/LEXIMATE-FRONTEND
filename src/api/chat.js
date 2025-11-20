import axios from './axios';

export const chatService = {
  /**
   * Get all chats for the current user
   */
  getUserChats: async () => {
    const response = await axios.get('/chat/user-chats');
    return response.data;
  },

  /**
   * Create a new chat with specified users
   */
  createChat: async (userIds) => {
    const response = await axios.post('/chat', { userIds });
    return response.data;
  },

  /**
   * Get all messages for a specific chat
   */
  getMessages: async (chatId) => {
    const response = await axios.get(`/chat/${chatId}/messages`);
    return response.data;
  },

  /**
   * Send a message in a chat
   */
  sendMessage: async (chatId, content) => {
    const response = await axios.post(`/chat/${chatId}/messages`, { content });
    return response.data;
  },
};
