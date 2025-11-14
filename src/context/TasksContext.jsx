import { createContext, useContext } from 'react';
import { useState } from 'react';
import {
  createTaskRequest,
  getTasksRequest,
  deleteTaskRequest,
  getTaskRequest,
  updateTaskRequest,
  createSubmitTaskRequest,
  getSubmittedTasksRequest
} from '../api/tasks';

const TaskContext = createContext();

const useTask = () => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }

  return context;
};

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const clearError = () => {
    setError(null);
  };

  const getTasks = async (classId) => {
    setIsLoading(true);
    try {
      const res = await getTasksRequest(classId);
      setTasks(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error during get tasks request:', error);
      setError(error.response.data);
      setIsLoading(false);
      throw error;
    }
  };

  const createTask = async (task, classId) => {
    try {
      setIsCreating(true);
      const res = await createTaskRequest(task, classId);
      return res;
    } catch (error) {
      console.log('Error during create task request:', error);
      setError(error.response.data);
      throw error;
    }finally {
      setIsCreating(false);
    }
  };

  const updateTask = async (id, task) => {
    try {
      await updateTaskRequest(id, task);
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  const deleteTask = async (classCode, id) => {
    try {
      const res = await deleteTaskRequest(classCode, id);
      if (res.status === 204) {
        setTasks(tasks.filter((task) => task._id !== id));
      }
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  const getTask = async (classId, taskId) => {
    try {
      const res = await getTaskRequest(classId, taskId);
      return res.data;
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  const submitTask = async (classId, taskId, submitData) => {
    setIsLoading(true);
    try {
      const res = await createSubmitTaskRequest(classId, taskId, submitData);
      setIsLoading(false);
      return res.data;
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubmittedTasks = async (classId, taskId) => {
    setIsLoading(true);
    try {
      const res = await getSubmittedTasksRequest(classId, taskId);
      setIsLoading(false);
      return res.data;
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        createTask,
        getTasks,
        getTask,
        updateTask,
        deleteTask,
        isLoading,
        isCreating,
        clearError,
        error,
        submitTask,
        getSubmittedTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskProvider, useTask };
