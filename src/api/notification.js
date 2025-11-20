import axios from './axios';

export const notificationService = {
  /**
   * Get all notifications for the current user
   */
  getAll: async () => {
    const response = await axios.get('/notification');
    return response.data;
  },

  /**
   * Get count of unread notifications
   */
  getUnreadCount: async () => {
    const response = await axios.get('/notification/unread-count');
    return response.data;
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (notificationId) => {
    const response = await axios.patch(`/notification/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const response = await axios.patch('/notification/mark-all-read');
    return response.data;
  },

  /**
   * Delete a notification
   */
  delete: async (notificationId) => {
    const response = await axios.delete(`/notification/${notificationId}`);
    return response.data;
  },
};
