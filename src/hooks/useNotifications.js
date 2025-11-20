import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { notificationService } from '../api/notification';

/**
 * Custom hook for managing notifications with real-time updates
 * @returns {Object} Notifications state and methods
 */
export const useNotifications = () => {
  const { on, off, connected } = useWebSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch initial notifications and unread count
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const [notifs, count] = await Promise.all([
          notificationService.getAll(),
          notificationService.getUnreadCount(),
        ]);
        setNotifications(notifs);
        setUnreadCount(count.count || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (connected) {
      fetchNotifications();
    }
  }, [connected]);

  // Listen for real-time notifications
  useEffect(() => {
    const handleNewNotification = (notification) => {
      console.log('🔔 New notification received:', notification);
      
      // Add to top of list
      setNotifications((prev) => [notification, ...prev]);
      
      // Increment unread count if not read
      if (!notification.read) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    on('notification', handleNewNotification);

    return () => {
      off('notification', handleNewNotification);
    };
  }, [on, off]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      // Decrement unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationService.delete(notificationId);
      
      // Remove from local state
      const deleted = notifications.find((n) => n.id === notificationId);
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
      
      // Decrement unread count if was unread
      if (deleted && !deleted.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
