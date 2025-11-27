import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import ChatList from "./ChatList";
import ChatInterface from "./ChatInterface";
import { X } from "lucide-react";
import HighlightLetter from "../ui/HighlightLetter";

const ChatWindow = () => {
  const { user } = useAuth();
  const {
    isOpen,
    activeChat,
    setActiveChat,
    closeChat,
    chats,
    loadingChats,
    fetchChats,
  } = useChat();

  useEffect(() => {
    if (isOpen && !activeChat) fetchChats();
  }, [isOpen, activeChat, fetchChats]);

  if (!user) return null;

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
        bg-white dark:bg-gray-800 shadow-xl flex flex-col z-50
        transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {!activeChat && (
          <div className="px-4 py-3 bg-gradient-to-l from-yellow-300 to-amber-400 flex justify-between shadow-md items-center">
            <HighlightLetter className="font-opendyslexic text-lg">
              Chats recientes
            </HighlightLetter>
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
            <ChatInterface
              chat={activeChat}
              onBack={() => setActiveChat(null)}
            />
          ) : (
            <ChatList
              chats={chats}
              activeChat={activeChat}
              onSelectChat={setActiveChat}
              loading={loadingChats}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
