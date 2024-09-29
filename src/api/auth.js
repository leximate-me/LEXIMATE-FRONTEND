import axios from './axios';

const registerRequest = async (user) => {
  try {
    const response = await axios.post(`/auth/register`, user);
    return response;
  } catch (error) {
    console.error('Error during register request:', error);
    throw error;
  }
};

const loginRequest = async (user) => {
  try {
    const response = await axios.post(`/auth/login`, user);
    return response;
  } catch (error) {
    console.error('Error during login request:', error);
    throw error;
  }
};

const logoutRequest = async () => {
  try {
    const response = await axios.post(`/auth/logout`);
    return response;
  } catch (error) {
    console.error('Error during logaut request:', error);
    throw error;
  }
};

const verifyToken = async () => {
  try {
    const response = await axios.get(`/auth/verify-token`);
    return response;
  } catch (error) {
    console.error('Error during token verification:', error);
    throw error;
  }
};

export { registerRequest, loginRequest, verifyToken, logoutRequest };
