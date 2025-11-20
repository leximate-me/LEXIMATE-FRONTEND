import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { chatService } from "../../api/chat";
import ChatList from "./ChatList";
import ChatInterface from "./ChatInterface";
import { X } from "lucide-react";
import HighlightLetter from "../ui/HighlightLetter";

const ChatWindow = () => {
  const { user } = useAuth();
  const { isOpen, toggleChat, activeChat, setActiveChat, closeChat } =
    useChat();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !activeChat) {
      fetchChats();
    }
  }, [isOpen, activeChat]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const data = await chatService.getUserChats();

      const processedChats = data.map((chat) => {
        const participants = chat.users || chat.participants || [];
        const other = participants.find((p) => p.id !== user.id);

        if (!other) {
          return {
            ...chat,
            otherUser: {
              id: null,
              name: "Usuario Desconocido",
              avatar: null,
            },
          };
        }

        const firstName = other.people?.first_name || other.first_name || "";
        const lastName = other.people?.last_name || other.last_name || "";
        const avatar =
          other.userFiles?.[0]?.file_url || other.avatar?.file_url || null;

        return {
          ...chat,
          otherUser: {
            id: other.id,
            name: `${firstName} ${lastName}`.trim() || "Usuario Desconocido",
            avatar,
          },
        };
      });

      setChats(processedChats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  const handleBackToList = () => {
    setActiveChat(null);
    fetchChats();
  };

  if (!user) return null;

  // ❗ ChatWindow SIN BOTÓN
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={closeChat}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-96 
        bg-white dark:bg-gray-800  dark:border-gray-700
        shadow-xl flex flex-col z-50
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
        onClick={(e) => e.stopPropagation()}
      >
        {!activeChat && (
          <div className="px-4 py-3 bg-gradient-to-l from-yellow-300 to-amber-400 flex justify-between shadow-md items-center">
            <HighlightLetter className="font-opendyslexic text-lg">Chats recientes</HighlightLetter>
            <button
              onClick={closeChat}
              className="p-1 hover:bg-gray-200 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          {activeChat ? (
            <ChatInterface chat={activeChat} onBack={handleBackToList} />
          ) : (
            <ChatList
              chats={chats}
              activeChat={activeChat}
              onSelectChat={handleSelectChat}
              loading={loading}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
