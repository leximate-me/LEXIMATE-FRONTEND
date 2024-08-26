import axios from './axios';

const getTasksRequest = async () => {
  try {
    const response = await axios.get(`/tasks`);
    return response;
  } catch (error) {
    console.error('Error during get tasks request:', error);
    throw error;
  }
};

const getTaskRequest = async (id) => {
  try {
    const response = await axios.get(`/tasks/${id}`);
    return response;
  } catch (error) {
    console.error('Error during get task request:', error);
    throw error;
  }
};

const createTaskRequest = async (task) => {
  try {
    const response = await axios.post(`/tasks`, task);
    return response;
  } catch (error) {
    console.error('Error during create task request:', error);
    throw error;
  }
};

const updateTaskRequest = async (id, task) => {
  try {
    const response = await axios.put(`/tasks/${id}`, task);
    return response;
  } catch (error) {
    console.error('Error during update task request:', error);
    throw error;
  }
};

const deleteTaskRequest = async (id) => {
  try {
    const response = await axios.delete(`/tasks/${id}`);
    return response;
  } catch (error) {
    console.error('Error during delete task request:', error);
    throw error;
  }
};

export {
  getTasksRequest,
  getTaskRequest,
  createTaskRequest,
  updateTaskRequest,
  deleteTaskRequest,
};
