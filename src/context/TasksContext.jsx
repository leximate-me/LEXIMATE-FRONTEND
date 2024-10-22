import { createContext, useContext } from 'react';
import { useState } from 'react';
import {
  createTaskRequest,
  getTasksRequest,
  deleteTaskRequest,
  getTaskRequest,
  updateTaskRequest,
} from '../api/tasks';
import { set } from 'react-hook-form';

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

  const getTasks = async (classCode) => {
    setIsLoading(true);
    try {
      const res = await getTasksRequest(classCode);
      setTasks(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error during get tasks request:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const createTask = async (task) => {
    const res = await createTaskRequest(task);
    console.log(res);
    return res;
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

  const getTask = async (id) => {
    try {
      const res = await getTaskRequest(id);
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
        isLoading
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskProvider, useTask };
