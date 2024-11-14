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

export {
    extractTextRequest,
};