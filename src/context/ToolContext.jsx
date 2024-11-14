import { createContext, useContext, useState } from 'react';
import { extractTextRequest } from "../api/tool";

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

    return (
        <ToolContext.Provider
            value={{
                error,
                isExtracting,
                extractedText,
                clearError,
                extractText
            }}>
            {children}
        </ToolContext.Provider>
    );
}

export { useTool, ToolProvider }
