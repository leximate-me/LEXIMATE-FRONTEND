import axios from './axios.js'

const extractTextRequest = async (url) => {
    try {
        const response = await axios.post(`/tool/extract-text-from-img?imageUrl=${url}`);
        return response;
    } catch (error) {
        console.error('Error during extract text request:', error);
        throw error;
    }
    }

const chatBotRequest = async (message) => {
    try {
        const response = await axios.post('/tool/chat-bot-response', { message });
        return response;
    } catch (error) {
        console.error('Error during chat bot request:', error);
        throw error;
    }
}

export {
    extractTextRequest,
    chatBotRequest,
};