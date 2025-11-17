import axios from './axios';

const getTasksRequest = async (classId) => {
  try {
    const response = await axios.get(`/course/${classId}/task`);
    return response;
  } catch (error) {
    console.error('Error during get tasks request:', error);
    throw error;
  }
};

const getTaskRequest = async (classId, taskId) => {
  try {
    const response = await axios.get(`/course/${classId}/task/${taskId}`);
    return response;
  } catch (error) {
    console.error('Error during get task request:', error);
    throw error;
  }
};

const createTaskRequest = async (task, classaId) => {
  try {
    const response = await axios.post(`/course/${classaId}/task`, task);
    return response;
  } catch (error) {
    console.error('Error during create task request:', error);
    throw error;
  }
};

const updateTaskRequest = async (id, task) => {
  try {
    const response = await axios.put(`/course/${classCode}/tasks/${id}`, task);
    return response;
  } catch (error) {
    console.error('Error during update task request:', error);
    throw error;
  }
};

const deleteTaskRequest = async (classCode, id) => {
  try {
    const response = await axios.delete(`/course/${classCode}/task/${id}`);
    return response;
  } catch (error) {
    console.error('Error during delete task request:', error);
    throw error;
  }
};

const createSubmitTaskRequest = async (classId, taskId, submitData) => {
  try {
    const response = await axios.post(`/course/${classId}/task/${taskId}/submissions`, submitData);
    return response;
  } catch (error) {
    console.error('Error during create submit task request:', error);
    throw error;
  }
};

const getSubmittedTasksRequest = async (classId, taskId) => {
  try {
    const response = await axios.get(`/course/${classId}/task/${taskId}/submissions`);
    return response;
  } catch (error) {
    console.error('Error during get submitted tasks request:', error);
    throw error;
  }
};

const qualifySubmittedTaskRequest = async (classId, taskId, userId, data) => {
  try {
    const response = await axios.patch(
      `/course/${classId}/task/${taskId}/submissions/${userId}/qualify`,
      data
    );
    return response;
  } catch (error) {
    console.error('Error during qualify submitted task request:', error);
    throw error;
  }
};

const deleteSubmittedTaskRequest = async (classId, taskId, submissionId) => {
  try {
    const response = await axios.delete(`/course/${classId}/task/${taskId}/submissions/${submissionId}`);
    return response;
  } catch (error) {
    console.error('Error during delete submitted task request:', error);
    throw error;
  }
};

export {
  getTasksRequest,
  getTaskRequest,
  createTaskRequest,
  updateTaskRequest,
  deleteTaskRequest,
  createSubmitTaskRequest,
  getSubmittedTasksRequest,
  qualifySubmittedTaskRequest,
  deleteSubmittedTaskRequest,
};
