import { createContext, useContext, useState } from 'react';
import { extractTextRequest, chatBotRequest } from "../api/tool";

const ToolContext = createContext();

const useTool = () => {
    const context = useContext(ToolContext);
    if (!context) throw new Error('useTool must be used within a ToolProvider');
    return context;
}

const ToolProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractedText, setExtractedText] = useState([]);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: '¡Hola! 👋 ¿En qué puedo ayudarte hoy?' }
    ]);

    const clearError = () => setError(null);

    const extractText = async (url) => {
        setIsExtracting(true);
        try {
            const res = await extractTextRequest(url);
            setExtractedText(res.data);
        } catch (error) {
            console.error('Error during extract text request:', error);
            setError(error.response?.data || 'Error extracting text');
            throw error;
        } finally {
            setIsExtracting(false);
        }
    }

    const chatBot = async (message) => {
        // agrega mensaje del usuario
        setChatMessages(prev => [...prev, { sender: 'user', text: message }]);

        try {
            const res = await chatBotRequest(message);
            // res.data.response es la respuesta del bot según tu ToolController
            const botResponse = res.data.response.output || 'No hay respuesta';
            setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
        } catch (error) {
            console.error('Error during chat bot request:', error);
            setChatMessages(prev => [...prev, { sender: 'bot', text: 'Ups, algo salió mal. Inténtalo de nuevo.' }]);
            setError(error.response?.data || 'Error chatting with bot');
            throw error;
        }
    }

    return (
        <ToolContext.Provider
            value={{
                chatMessages,
                chatBot,
                error,
                isExtracting,
                extractedText,
                clearError,
                extractText,
                setExtractedText
            }}
        >
            {children}
        </ToolContext.Provider>
    );
}

export { useTool, ToolProvider };
