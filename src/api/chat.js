import axios from './axios';

export const chatService = {
  getUserChats: async () => {
    const response = await axios.get('/chat/user-chats');
    return response.data;
  },
  createChat: async (userIds) => {
    const response = await axios.post('/chat', { userIds });
    return response.data;
  },
  getMessages: async (chatId) => {
    const response = await axios.get(`/chat/${chatId}/messages`);
    return response.data;
  },
  sendMessage: async (chatId, content) => {
    try {
      const response = await axios.post(`/chat/${chatId}/messages`, { content });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  markAsRead: async (chatId) => {
    const response = await axios.patch(`/chat/${chatId}/read`);
    return response.data;
  }
};
