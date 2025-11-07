import React, { useEffect, useRef, useState } from "react";
import { useTool } from "../context/ToolContext";
import { Square, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Bot } from 'lucide-react';
import HighlightLetter from "./ui/HighlightLetter";


const ChatbotModal = ({ onClose }) => {
    const { chatMessages, chatBot } = useTool();
    const [inputValue, setInputValue] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isWriting, setIsWriting] = useState(false);

    const messagesContainerRef = useRef(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // espera a que termine la animación
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessageText = inputValue;

        // Limpiamos el input inmediatamente
        setInputValue('');

        setIsWriting(true);
        // Agregamos el mensaje del usuario al estado global
        try {
            await chatBot(userMessageText);
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
        setIsWriting(false);
    };


    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black/40 z-[99999] transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div className={`fixed bottom-6 right-6 bg-[#fdf7d6] w-[350px] h-[500px] rounded-2xl shadow-xl flex flex-col justify-between transition-all duration-300 ${isVisible ? "translate-y-0 translate-x-0 opacity-100" : "translate-x-10 translate-y-10 opacity-0"}`}>

                <div>
                    <div className="bg-yellow-300 rounded-t-lg">
                        {/* Botón cerrar */}
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 text-gray-700 hover:text-black text-lg font-semibold"
                        >
                            ✕
                        </button>

                        {/* Encabezado */}
                        <div className="flex items-center gap-3 border-b border-yellow-200 p-2">
                            <div className="bg-gray-700 rounded-full p-2">
                                <Bot className="text-white" />
                            </div>
                            <HighlightLetter className="h-full font-opendyslexic font-bold" size="text-md" color="green">
                                Asistente Virtual
                            </HighlightLetter>
                        </div>
                    </div>

                    {/* Mensajes */}
                    <div ref={messagesContainerRef} className="m-4 max-h-80 overflow-y-auto space-y-3">
                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-3 py-2 rounded-xl text-sm text-gray-800 max-w-[80%] whitespace-pre-wrap font-opendyslexic ${msg.sender === "user"
                                        ? "bg-white border border-yellow-300 rounded-br-none"
                                        : "bg-yellow-200 rounded-bl-none"
                                        }`}
                                >
                                    <ReactMarkdown
                                        components={{
                                            h3: ({ ...props }) => <h3 className="text-md font-bold mb-1" {...props} />,
                                            ul: ({ ...props }) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                                            li: ({ ...props }) => <li className="text-sm" {...props} />,
                                            strong: ({ ...props }) => <strong className="font-bold" {...props} />,
                                            p: ({ ...props }) => <p className="mb-1" {...props} />
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {isWriting && (
                            <div className="flex justify-start">
                                <div className="px-3 py-2 rounded-xl text-sm text-gray-800 bg-yellow-200 rounded-bl-none animate-pulse">
                                    <span className="loading loading-dots loading-xl"></span>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Input */}
                <div className="m-4 flex items-center border border-yellow-300 rounded-xl overflow-hidden">
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        className="flex-1 m-2 px-3 py-2 text-sm bg-transparent focus:outline-none"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isWriting}
                        className="bg-yellow-300 m-2 rounded-lg hover:bg-yellow-400 px-4 py-2 text-gray-800 font-semibold transition"
                    >
                        {isWriting ? <Square /> : <Send />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatbotModal;
