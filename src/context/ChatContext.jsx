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
          setActiveChat(existingChat);
          return existingChat;
        }

        const chat = await chatService.createChat([userId]);

        const processedChat = processChats([chat])[0];

        setActiveChat(processedChat);
        setChats((prev) => [...(prev || []), processedChat]);

        return processedChat;
      } catch (err) {
        console.error("Error starting chat:", err);
      }
    },
    [chats, fetchChats, processChats]
  );

  useEffect(() => {
    const handleIncomingMessage = (message) => {
      if (activeChat && activeChat.id === message.chatId) {
        setMessages((prevMessages) => {
          if (prevMessages.some((m) => m.id === message.id)) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });
      }
    };

    on("chat_message", handleIncomingMessage);

    return () => {
      off("chat_message", handleIncomingMessage);
    };
  }, [activeChat, on, off, setMessages]);

  const value = {
    isOpen,
    activeChat,
    setActiveChat,
    chats,
    loadingChats,
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