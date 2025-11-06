    import { createContext, useContext, useState } from 'react';
    import { extractTextRequest, chatBotRequest } from "../api/tool";

    const ToolContext = createContext();

    const useTool = () => {
        const context = useContext(ToolContext);

        if (!context) {
            throw new Error('useTool must be used within a ToolProvider');
        }

        return context;
    }

    const ToolProvider = ({ children }) => {

        const [error, setError] = useState(null);
        const [isExtracting, setisExtracting] = useState(false);
        const [extractedText, setExtractedText] = useState([]);
        const [chatMsg, setChatMsg] = useState([]);

        const clearError = () => {
            setError(null);
        }

        const extractText = async (url) => {
            setisExtracting(true);
            try {
                const res = await extractTextRequest(url);
                setExtractedText(res.data);
            } catch (error) {
                console.error('Error during extract text request:', error);
                setError(error.response?.data || 'Error extracting text');
                throw error;
            } finally {
                setisExtracting(false);
            }
        }

        const chatBot = async (message) => {
            try {
                const res = await chatBotRequest(message);
                setChatMsg(res.data);
            } catch (error) {
                console.error('Error during chat bot request:', error);
                setError(error.response?.data || 'Error chatting with bot');
                throw error;
            }
        }

        return (
            <ToolContext.Provider
                value={{
                    chatMsg,
                    chatBot,
                    error,
                    isExtracting,
                    extractedText,
                    clearError,
                    extractText,
                    setExtractedText
                }}>
                {children}
            </ToolContext.Provider>
        );
    }

    export { useTool, ToolProvider }
