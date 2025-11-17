import { createContext, useContext, useState, useCallback } from 'react';
import {
  createTaskRequest,
  getTasksRequest,
  deleteTaskRequest,
  getTaskRequest,
  updateTaskRequest,
  createSubmitTaskRequest,
  getSubmittedTasksRequest,
  qualifySubmittedTaskRequest,
  deleteSubmittedTaskRequest,
} from '../api/tasks';

const TaskContext = createContext();

const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within a TaskProvider');
  return context;
};

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getTasks = useCallback(async (classId) => {
    setIsLoading(true);
    try {
      const res = await getTasksRequest(classId);
      setTasks(res.data);
    } catch (error) {
      console.error('Error during get tasks request:', error);
      setError(error.response?.data);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (task, classId) => {
    try {
      setIsCreating(true);
      const res = await createTaskRequest(task, classId);
      return res;
    } catch (error) {
      console.log('Error during create task request:', error);
      setError(error.response?.data);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateTask = useCallback(async (id, task) => {
    try {
      await updateTaskRequest(id, task);
    } catch (error) {
      setError(error.response?.data);
    }
  }, []);

  const deleteTask = useCallback(async (classCode, id) => {
    try {
      const res = await deleteTaskRequest(classCode, id);
      if (res.status === 204) {
        setTasks(prev => prev.filter(task => task._id !== id));
      }
      return res;
    } catch (error) {
      setError(error.response?.data);
    }
  }, []);

  const getTask = useCallback(async (classId, taskId) => {
    try {
      const res = await getTaskRequest(classId, taskId);
      return res.data;
    } catch (error) {
      setError(error.response?.data);
    }
  }, []);

  const submitTask = useCallback(async (classId, taskId, submitData) => {
    setIsLoading(true);
    try {
      const res = await createSubmitTaskRequest(classId, taskId, submitData);
      return res.data;
    } catch (error) {
      setError(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSubmittedTasks = useCallback(async (classId, taskId) => {
    setIsLoading(true);
    try {
      const res = await getSubmittedTasksRequest(classId, taskId);
      return res.data;
    } catch (error) {
      setError(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const qualifyTask = useCallback(async (classId, taskId, userId, data) => {
    setIsLoading(true);
    try {
      const res = await qualifySubmittedTaskRequest(classId, taskId, userId, data);
      return res.data;
    } catch (error) {
      setError(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSubmittedTask = useCallback(async (classId, taskId, submissionId) => {
    setIsLoading(true);
    try {
      const res = await deleteSubmittedTaskRequest(classId, taskId, submissionId);
      return res.data;
    } catch (error) {
      setError(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
        getSubmittedTasks,
        qualifyTask,
        deleteSubmittedTask,
        isLoading
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskProvider, useTask };
