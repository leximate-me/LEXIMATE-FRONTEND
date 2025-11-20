import { useWebSocketContext } from '../context/WebSocketContext';

/**
 * Custom hook to access WebSocket functionality
 * @returns {Object} WebSocket context with connected, on, off, send methods
 */
export const useWebSocket = () => {
  return useWebSocketContext();
};
