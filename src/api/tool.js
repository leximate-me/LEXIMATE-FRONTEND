import axios from "./axios.js";

const extractTextRequest = async (url) => {
  const newUrl = url.replace(/^\/public\//, "/");
  console.log("Extracting text from:", newUrl);
  try {
    const response = await axios.get(
      `/tool/extract-text-from-local-url?localUrl=${newUrl}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error during extract text request:", error);
    throw error;
  }
};

const chatBotRequest = async (message) => {
  try {
    const response = await axios.post("/tool/chat-bot-response", { message });
    return response;
  } catch (error) {
    console.error("Error during chat bot request:", error);
    throw error;
  }
};

export { extractTextRequest, chatBotRequest };
