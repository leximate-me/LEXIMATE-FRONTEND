import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { chatService } from "../api/chat";
import { useAuth } from "./AuthContext";

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

  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);
  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => {
    setIsOpen(false)
    setActiveChat(null);
  }, []);

  const fetchChats = useCallback(async () => {
    setLoadingChats(true);
    try {
      const data = await chatService.getUserChats();
      const processed = data.map((chat) => {
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
      setChats(processed);
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setLoadingChats(false);
    }
  }, [user]);

  const startChatWithUser = useCallback(
  async (userId) => {
    try {
      setIsOpen(true);

      // Esperar que chats estén cargados
      if (!chats || chats.length === 0) {
        await fetchChats();
      }

      // Buscar chat existente en el estado
      const existingChat = chats?.find((chat) =>
        chat.users?.some((u) => u.id === userId)
      );

      if (existingChat) {
        setActiveChat(existingChat);
        return existingChat;
      }

      // Si no existe, crear nuevo
      const chat = await chatService.createChat([userId]);

      const participants = chat.users || chat.participants || [];
      const other = participants.find((p) => p.id !== user.id);

      const firstName = other?.people?.first_name || other?.first_name || "";
      const lastName = other?.people?.last_name || other?.last_name || "";
      const avatar =
        other?.userFiles?.[0]?.file_url || other?.avatar?.file_url || null;

      const processedChat = {
        ...chat,
        participants,
        otherUser: other
          ? {
              id: other.id,
              name: `${firstName} ${lastName}`.trim() || "Usuario Desconocido",
              avatar,
            }
          : { id: null, name: "Usuario Desconocido", avatar: null },
      };

      setActiveChat(processedChat);
      setChats((prev) => [...(prev || []), processedChat]);
      return processedChat;
    } catch (err) {
      console.error("Error starting chat:", err);
    }
  },
  [user, chats, fetchChats]
);


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
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
