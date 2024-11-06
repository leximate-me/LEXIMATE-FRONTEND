import { createContext, useContext } from 'react';
import { useState } from 'react';
import {
  createTaskRequest,
  getTasksRequest,
  deleteTaskRequest,
  getTaskRequest,
  updateTaskRequest,
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
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const getTasks = async (classId) => {
    setIsLoading(true);
    try {
      const res = await getTasksRequest(classId);

      setTasks(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error during get tasks request:', error);
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
    }
  };

  const getTask = async (classId, taskId) => {
    try {
      const res = await getTaskRequest(classId, taskId);
      return res.data;
    } catch (error) {
      console.log(error);
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
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskProvider, useTask };
