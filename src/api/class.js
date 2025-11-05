import axios from './axios';

const getClassesRequest = async () => {
  try {
    const response = await axios.get(`course/user`);
    return response;
  } catch (error) {
    console.error('Error during getClasses request:', error);
    throw error;
  }
};

const createClassesRequest = async (newClass) => {
  try {
    const response = await axios.post(`course/`, newClass);
    return response;
  } catch (error) {
    console.error('Error during createClasses request:', error);
    throw error;
  }
};

const joinClassRequest = async (classCode) => {
  try {
    const response = await axios.post(`course/join`, classCode);
    return response;
  } catch (error) {
    console.log('Error during joinClass request:', error);
    throw error;
  }
};

const leaveClassRequest = async (classId) => {
  try {
    const response = await axios.post(`course/${classId}/leave`);
    return response;
  } catch (error) {
    console.log('Error during leaveClass request:', error);
    throw error;
  }
};

const deleteClassRequest = async (classId) => {
  try {
    const response = await axios.delete(`course/${classId}`);
    return response;
  } catch (error) {
    console.log('Error during deleteClass request:', error);
    throw error;
  }
};

const getUsersByClassRequest = async (classId) => {
  try {
    const response = await axios.get(`course/${classId}/user`);
    return response;
  } catch (error) {
    console.error('Error during getUsersByClass request:', error);
    throw error;
  }
};

export {
  getClassesRequest,
  createClassesRequest,
  joinClassRequest,
  leaveClassRequest,
  deleteClassRequest,
  getUsersByClassRequest,
};
