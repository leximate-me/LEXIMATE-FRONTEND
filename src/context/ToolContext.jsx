import { createContext, useContext, useEffect, useState } from 'react';
import { extractTextRequest, chatBotRequest } from "../api/tool";
import { getProfileRequest } from '../api/auth';
import { progress } from 'framer-motion';

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
    const [profile, setProfile] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);

    const clearError = () => setError(null);

    const fetchProfile = async () => {
        try {
            const res = await getProfileRequest();
            setProfile(res.data);
            console.log('context', profile)
            // Agrega el saludo del bot **solo después de obtener el profile**
            setChatMessages([
                { sender: 'bot', text: `¡Hola! ${profile?.user?.person?.first_name || 'Usuario'} 👋 ¿En qué puedo ayudarte hoy?` }
            ]);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError(error.response?.data || 'Error fetching profile');
        }
    };

    const extractText = async (url) => {
        setIsExtracting(true);
        try {
            const res = await extractTextRequest(url);
            setExtractedText([res]);
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
            const botResponse = res.data.response.output || 'No hay respuesta';
            setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
        } catch (error) {
            console.error('Error during chat bot request:', error);
            setChatMessages(prev => [...prev, { sender: 'bot', text: 'Ups, algo salió mal. Inténtalo de nuevo.' }]);
            setError(error.response?.data || 'Error chatting with bot');
            throw error;
        }
    }

    // Traer el profile al montar el provider
    useEffect(() => {
        fetchProfile();
    }, []);

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
