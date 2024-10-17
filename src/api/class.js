import axios from './axios';

const getClassesRequest = async () => {
  try {
    const response = await axios.get(`/class/user`);
    return response;
  } catch (error) {
    console.error('Error during getClasses request:', error);
    throw error;
  }
};

const createClassesRequest = async (newClass) => {
  try {
    const response = await axios.post(`/class/`, newClass);
    return response;
  } catch (error) {
    console.error('Error during createClasses request:', error);
    throw error;
  }
};

const joinClassRequest = async (classCode) => {
  try {
    const response = await axios.post(`/class/join`, classCode);
    return response;
  } catch (error) {
    console.log('Error during joinClass request:', error);
    throw error;
  }
};

export { getClassesRequest, createClassesRequest, joinClassRequest };
