import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { chatService } from "../api/chat";
import { useAuth } from "./AuthContext";
import { useWebSocketContext } from "./WebSocketContext";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]); // New state for online users
  const { user } = useAuth();
  const { on, off } = useWebSocketContext();

  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);
  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => {
    setIsOpen(false);
    setActiveChat(null);
  }, []);

  const processChats = useCallback(
    (data) => {
      return data.map((chat) => {
        const participants = chat.users || chat.participants || [];
        const other = participants.find((p) => p.id !== user.id);

        const firstName = other?.people?.first_name || other?.first_name || "";
        const lastName = other?.people?.last_name || other?.last_name || "";
        const avatar =
          other?.userFiles?.[0]?.file_url || other?.avatar?.file_url || null;

        return {
          ...chat,
          otherUser: other
            ? {
              id: other.id,
              name:
                `${firstName} ${lastName}`.trim() || "Usuario Desconocido",
              avatar,
            }
            : { id: null, name: "Usuario Desconocido", avatar: null },
        };
      });
    },
    [user]
  );

  const fetchChats = useCallback(async () => {
    setLoadingChats(true);
    try {
      const data = await chatService.getUserChats();
      const processed = processChats(data);
      setChats(processed);
      return processed;
    } catch (err) {
      console.error("Error fetching chats:", err);
      return [];
    } finally {
      setLoadingChats(false);
    }
  }, [processChats]);

  const setMessages = (updater) => {
    setActiveChat((prev) => {
      if (!prev) return prev;

      const currentMessages = Array.isArray(prev.messages) ? prev.messages : [];

      const nextMessages =
        typeof updater === "function" ? updater(currentMessages) : updater;

      return {
        ...prev,
        messages: nextMessages,
      };
    });
  };

  const sendMessage = useCallback(async (chatId, content) => {
    try {
      const msg = await chatService.sendMessage(chatId, content);

      setMessages((prev) => {
        if (!prev) return [msg];
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      return msg;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }, [setMessages]);

  const startChatWithUser = useCallback(
    async (userId) => {
      try {
        setIsOpen(true);

        let loadedChats = chats;

        if (!chats || chats.length === 0) {
          loadedChats = await fetchChats();
        }

        const existingChat = loadedChats.find((chat) =>
          chat.users?.some((u) => u.id === userId)
        );

        if (existingChat) {
          handleSelectChat(existingChat);
          return existingChat;
        }

        const chat = await chatService.createChat([userId]);

        const processedChat = processChats([chat])[0];

        handleSelectChat(processedChat);
        setChats((prev) => [...(prev || []), processedChat]);

        return processedChat;
      } catch (err) {
        console.error("Error starting chat:", err);
      }
    },
    [chats, fetchChats, processChats]
  );

  // Wrapper for setActiveChat to handle markAsRead
  const handleSelectChat = async (chat) => {
    setActiveChat(chat);
    if (chat && chat.unreadCount > 0) {
      // Optimistic update
      setChats(prev => prev.map(c =>
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      ));

      try {
        await chatService.markAsRead(chat.id);
      } catch (error) {
        console.error("Error marking chat as read:", error);
        // Revert if error? For now, keep optimistic
      }
    }
  };

  useEffect(() => {
    const handleIncomingMessage = (message) => {
      // If chat is active, append message
      if (activeChat && activeChat.id === message.chatId) {
        setMessages((prevMessages) => {
          if (prevMessages.some((m) => m.id === message.id)) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });
        // Mark as read immediately if active
        chatService.markAsRead(message.chatId).catch(console.error);
      } else {
        // If not active, increment unread count in chat list
        setChats(prev => prev.map(c =>
          c.id === message.chatId
            ? { ...c, unreadCount: (c.unreadCount || 0) + 1, messages: [...c.messages, message] }
            : c
        ));
      }
    };

    const handleUserOnline = ({ userId }) => {
      console.log("🟢 User Online Event:", userId);
      setOnlineUsers(prev => [...new Set([...prev, String(userId)])]);
    };

    const handleUserOffline = ({ userId }) => {
      console.log("🔴 User Offline Event:", userId);
      setOnlineUsers(prev => prev.filter(id => id !== String(userId)));
    };

    const handleOnlineUsers = ({ userIds }) => {
      console.log("👥 Initial Online Users:", userIds);
      setOnlineUsers(userIds.map(id => String(id)));
    };

    on("chat_message", handleIncomingMessage);
    on("user_online", handleUserOnline);
    on("user_offline", handleUserOffline);
    on("online_users", handleOnlineUsers);

    return () => {
      off("chat_message", handleIncomingMessage);
      off("user_online", handleUserOnline);
      off("user_offline", handleUserOffline);
      off("online_users", handleOnlineUsers);
    };
  }, [activeChat, on, off, setMessages]);

  const totalUnreadCount = chats.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0);

  const value = {
    isOpen,
    activeChat,
    setActiveChat: handleSelectChat, // Use our wrapper
    chats,
    loadingChats,
    onlineUsers, // Expose online users
    totalUnreadCount, // Expose total unread count
    fetchChats,
    toggleChat,
    openChat,
    closeChat,
    startChatWithUser,
    sendMessage,
    setMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};