import { useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

/**
 * Custom hook for listening to real-time WebSocket events
 * @param {string} eventType - The event type to listen for (e.g., 'post_created', 'task_updated')
 * @param {Function} callback - Callback function to handle the event data
 * @param {Array} deps - Dependencies array for the effect
 */
export const useRealTimeUpdates = (eventType, callback, deps = []) => {
  const { on, off } = useWebSocket();

  useEffect(() => {
    if (!eventType || !callback) return;

    console.log(`👂 Listening for ${eventType} events`);

    const handler = (data) => {
      console.log(`📡 Received ${eventType}:`, data);
      callback(data);
    };

    on(eventType, handler);

    return () => {
      off(eventType, handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType, on, off, ...deps]);
};
