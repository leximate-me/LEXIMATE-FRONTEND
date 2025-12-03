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

    useEffect(() => setIsVisible(true), []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        const userMessageText = inputValue;
        setInputValue('');
        setIsWriting(true);
        try { await chatBot(userMessageText); } catch (error) { console.error(error); }
        setIsWriting(false);
    };

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    // Convierte cualquier "children" de ReactMarkdown a string
    const normalizeChildren = (children) => {
        if (typeof children === "string") return children;
        if (Array.isArray(children)) return children.map(normalizeChildren).join("");
        if (typeof children === "object" && children !== null) {
            if (children.props && children.props.children) {
                return normalizeChildren(children.props.children);
            }
            return "";
        }
        return "";
    };

    // Función para estilizar primera y última letra
    const stylizeEdges = (children, color = "text-red-600") => {
        const text = normalizeChildren(children);
        if (!text) return null;

        const firstChar = text[0];
        const lastChar = text[text.length - 1];
        const middle = text.slice(1, -1);

        return (
            <>
                <span className={`${color} text-xl font-bold tracking-very-wide`}>{firstChar}</span>
                <span className="text-gray-800 text-base tracking-very-wide font-bold">{middle}</span>
                {text.length > 1 && <span className={`${color} text-xl font-bold tracking-very-wide`}>{lastChar}</span>}
            </>
        );
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black/40 z-[99999] transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div className={`fixed bottom-6 right-6 bg-[#fdf7d6] w-[350px] h-[500px] rounded-2xl shadow-xl flex flex-col justify-between transition-all duration-300 ${isVisible ? "translate-y-0 translate-x-0 opacity-100" : "translate-x-10 translate-y-10 opacity-0"}`}>
                <div>
                    <div className="bg-yellow-300 rounded-t-lg relative">
                        <button onClick={handleClose} className="absolute top-3 right-3 text-gray-700 hover:text-black text-lg font-semibold">✕</button>
                        <div className="flex items-center gap-3 border-b border-yellow-200 p-3">
                            <div className="bg-gray-700 rounded-full p-2">
                                <Bot className="text-white" />
                            </div>
                            <HighlightLetter color="green" size="text-lg" className="h-full font-bold">Asistente Virtual</HighlightLetter>
                        </div>
                    </div>

                    {/* Mensajes */}
                    <div ref={messagesContainerRef} className="m-4 max-h-80 overflow-y-auto space-y-4 pr-2">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`shadow-lg px-4 py-3 rounded-xl text-sm text-gray-800 max-w-[80%] whitespace-pre-wrap font-opendyslexic leading-relaxed ${msg.sender === "user" ? "bg-white border rounded-br-none" : "bg-yellow-200 rounded-bl-none"}`}>
                                    <ReactMarkdown
                                        components={{
                                            p: ({ children }) => <p className="mb-4">{stylizeEdges(children, "text-red-600")}</p>,
                                            h3: ({ children }) => <h3 className="mb-4 font-bold text-lg">{stylizeEdges(children, "text-green-600")}</h3>,
                                            strong: ({ children }) => <strong>{stylizeEdges(children, "text-red-600")}</strong>,
                                            em: ({ children }) => <em>{stylizeEdges(children, "text-blue-600")}</em>,
                                            li: ({ children }) => <li>{stylizeEdges(children, "text-purple-600")}</li>,
                                            ul: ({ children }) => <ul className="pl-4 list-disc space-y-1">{children}</ul>,
                                            ol: ({ children }) => <ol className="pl-4 list-decimal space-y-1">{children}</ol>,
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {isWriting && (
                            <div className="flex justify-start">
                                <div className="shadow-md px-4 py-3 rounded-xl text-sm text-gray-800 bg-yellow-200 rounded-bl-none animate-pulse">
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
