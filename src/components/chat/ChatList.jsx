import { formatDistanceToNow } from "date-fns";
import { es, id } from "date-fns/locale";
import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import HighlightLetter from "../ui/HighlightLetter";

const ChatList = ({ chats, activeChat, onSelectChat, loading }) => {

  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p>Cargando chats...</p>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
        <MessageCircle className="w-12 h-12 mb-2 opacity-20" />
        <p>No tienes conversaciones activas.</p>
        <p className="text-xs mt-2">
          Busca un profesor o compañero para chatear.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3">
      {chats.map((chat) => {
        const currentUserId = user.id;
        const otherUser = chat.otherUser || { name: "Usuario", avatar: null };
        const lastMessage = chat.messages[chat.messages.length - 1];

        return (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`bg-pastelVeryLightYellow rounded-lg shadow-md flex items-center gap-3 p-3 cursor-pointer transition-colors border-b hover:bg-pastelYellow relative`}
          >
            <div className="relative flex-shrink-0">
              {otherUser.avatar ? (
                <img
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  className="w-10 h-10 rounded-full border border-gray-500 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <HighlightLetter size="text-sm" color='green' className="font-opendyslexic truncate">
                  {otherUser.name}
                </HighlightLetter>
                {lastMessage && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                    {formatDistanceToNow(new Date(lastMessage.createdAt), {
                      addSuffix: false,
                      locale: es,
                    })}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                {currentUserId === lastMessage?.senderId ? (
                  <p className="text-sm italic text-gray-600 dark:text-gray-400 mr-2 truncate">
                    Tu: {lastMessage ? lastMessage.content : "Iniciar conversación"}
                  </p>
                ) : (
                  <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {lastMessage ? lastMessage.content : "Iniciar conversación"}
                  </p>
                )}

                {chat.unreadCount > 0 && (
                  <span className="bg-red-500 rounded-full w-3 h-3 ml-2"></span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

import { MessageCircle } from "lucide-react";

export default ChatList;
