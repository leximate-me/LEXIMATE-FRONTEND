import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { websocketService } from '../services/websocket.service';

const WebSocketContext = createContext(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      'useWebSocketContext must be used within WebSocketProvider'
    );
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const wsInitialized = useRef(false);

  useEffect(() => {
    if (wsInitialized.current) return;

    // Determine WebSocket URL based on environment
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = 'localhost:8080';
    const wsUrl = `${protocol}//${host}/ws`;

    console.log('🔌 Connecting to WebSocket:', wsUrl);

    // Handle connection events
    const handleConnected = () => {
      setConnected(true);
      setReconnecting(false);
      console.log('✅ WebSocket connected successfully');
    };

    const handleDisconnected = () => {
      setConnected(false);
      setReconnecting(true);
    };

    const handleMaxReconnectAttempts = () => {
      setConnected(false);
      setReconnecting(false);
      console.error(
        '❌ Failed to reconnect to WebSocket after maximum attempts'
      );
    };

    // Subscribe to connection events
    websocketService.on('connected', handleConnected);
    websocketService.on('disconnected', handleDisconnected);
    websocketService.on('max_reconnect_attempts', handleMaxReconnectAttempts);

    // Connect to WebSocket
    websocketService.connect(wsUrl);
    wsInitialized.current = true;

    // Ping interval to keep connection alive
    const pingInterval = setInterval(() => {
      if (websocketService.isConnected()) {
        websocketService.ping();
      }
    }, 30000); // Every 30 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(pingInterval);
      websocketService.off('connected', handleConnected);
      websocketService.off('disconnected', handleDisconnected);
      websocketService.off(
        'max_reconnect_attempts',
        handleMaxReconnectAttempts
      );
      websocketService.disconnect();
      wsInitialized.current = false;
    };
  }, []);

  const on = useCallback((event, handler) => {
    websocketService.on(event, handler);
  }, []);

  const off = useCallback((event, handler) => {
    websocketService.off(event, handler);
  }, []);

  const send = useCallback((data) => {
    websocketService.send(data);
  }, []);

  const value = {
    connected,
    reconnecting,
    on,
    off,
    send,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
