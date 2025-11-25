import React, { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft } from "lucide-react";
import ChatMessage from "./ChatMessage";
import HighlightLetter from "../ui/HighlightLetter";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { use } from "react";

const ChatInterface = ({ onBack }) => {
  const { user } = useAuth();
  const { activeChat, loadingChats, sendMessage, setMessages } = useChat();

  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null); // Nuevo estado para el error
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Evita crash si no hay chat activo
  if (!activeChat) return null;


  const otherUser = activeChat?.otherUser || { name: "Usuario" };

  // Scroll automático al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat.messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setError(null); // Limpiar errores anteriores al intentar enviar
    const contentToSend = newMessage.trim();

    try {
      const sentMessage = await sendMessage(activeChat.id, contentToSend);

      // Éxito: limpiar input y error
      setNewMessage("");
      setError(null);

      setMessages((prev) => {
        if (!Array.isArray(prev)) return [sentMessage];
        if (prev.some((m) => m.id === sentMessage.id)) return prev;
        return [...prev, sentMessage];
      });
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);

      // Fracaso: capturar y mostrar el error.
      // Intentamos obtener el mensaje de error de la respuesta del servidor o usamos un fallback.
      const errorMessage =
        error ? 'El mensaje debe tener al menos 3 caractéres.' : null

      setError(errorMessage);

      // No limpiamos setNewMessage(contentToSend) para que el usuario pueda corregir el texto.
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-pastelYellow shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {otherUser.avatar ? (
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="border border-gray-500 w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm">
                {otherUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <HighlightLetter
                size="text-lg"
                className="font-opendyslexic text-sm font-semibold"
              >
                {otherUser.name}
              </HighlightLetter>
              <span className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                En línea
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loadingChats ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : activeChat.messages.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>No hay mensajes aún.</p>
            <p className="text-sm">¡Envía un saludo!</p>
          </div>
        ) : (
          <>
            {Array.isArray(activeChat?.messages) &&
              activeChat.messages.map((msg) => (
                <ChatMessage
                  key={msg?.id || Math.random()}
                  message={msg}
                  isOwn={msg?.senderId === user?.id}
                />
              ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                setError(null); // Limpiar el error cuando el usuario empieza a escribir
              }}
              placeholder="Escribe un mensaje..."
              className={`flex-1 px-4 py-2 bg-gray-100 border dark:bg-gray-700 rounded-full dark:text-white placeholder-gray-500 
                ${error ? "border-red-500" : ""}
              `} // Opcional: añadir clase de error al input
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {/* Mostrar Error */}
          {error && (
            <p className="text-sm text-red-500 px-4">{error}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
