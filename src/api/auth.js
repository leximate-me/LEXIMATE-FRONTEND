import axios from "./axios";

const registerRequest = async (user) => {
  try {
    const response = await axios.post(`/auth/register`, user);
    return response;
  } catch (error) {
    console.error("Error during register request:", error);
    throw error;
  }
};

const loginRequest = async (user) => {
  try {
    const response = await axios.post(`/auth/login`, user);
    return response;
  } catch (error) {
    console.error("Error during login request:", error);
    throw error;
  }
};

const logoutRequest = async () => {
  try {
    const response = await axios.post(`/auth/logout`);
    return response;
  } catch (error) {
    console.error("Error during logaut request:", error);
    throw error;
  }
};

const verifyToken = async () => {
  try {
    const response = await axios.get(`/auth/verify-token`);
    return response;
  } catch (error) {
    console.error("Error during token verification:", error);
    throw error;
  }
};

const verifyEmailRequest = async () => {
  try {
    const response = await axios.post(`/auth/send-email-verification`);
    return response;
  } catch (error) {
    console.error("Error during email verification:", error);
    throw error;
  }
};

const getProfileRequest = async () => {
  try {
    const response = await axios.get(`/auth/profile`);
    return response;
  } catch (error) {
    console.error("Error during profile request:", error);
    throw error;
  }
};

const updateUserRequest = async (user) => {
  try {
    const response = await axios.put(`/auth/update-profile`, user);
    return response;
  } catch (error) {
    console.error("Error during user update request:", error);
    throw error;
  }
};

const assignRoleRequest = async (user) => {
  console.log("📤 Enviando a backend:", JSON.stringify(user, null, 2));
  try {
    const response = await axios.post(`/auth/verify-user`, user);
    console.log("📥 Backend respondió:", response);
    return response;
  } catch (error) {
    console.error(
      "❌ Error en assignRoleRequest:",
      error.response?.data || error,
    );
    throw error;
  }
};

const getUnverifiedUsersRequest = async () => {
  try {
    const response = await axios.get(`/auth/unverified-users`);
    return response;
  } catch (error) {
    console.error("Error during unverified users request:", error);
    throw error;
  }
};

export {
  registerRequest,
  loginRequest,
  verifyToken,
  logoutRequest,
  verifyEmailRequest,
  getProfileRequest,
  updateUserRequest,
  assignRoleRequest,
  getUnverifiedUsersRequest,
};
