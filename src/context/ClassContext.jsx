import { createContext, useState, useContext, useEffect } from 'react';
import {
  getClassesRequest,
  createClassesRequest,
  joinClassRequest,
  leaveClassRequest,
  deleteClassRequest,
} from '../api/class';

const ClassContext = createContext();

const useClass = () => {
  const context = useContext(ClassContext);

  if (!context) {
    throw new Error('useClass must be used within a ClassProvider');
  }

  return context;
};

const ClassProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const clearError = () => {
    setError(null);
  };

  const getClasses = async () => {
    setIsLoading(true); // Indicar que se está cargando
    try {
      const res = await getClassesRequest();
      setClasses(res.data);
      setIsLoading(false); // Indicar que se ha terminado de cargar
    } catch (error) {
      console.log(
        'Error during get classes request:',
        error.response.data.error
      );
      setError(error.response.data);
      setIsLoading(false);
      throw error;
    }
  };

  const createClass = async (newClass) => {
    try {
      setIsCreating(true);
      const res = await createClassesRequest(newClass);
      return res.data;
    } catch (error) {
      console.log('Error during create class request:', error.response.data);
      setError(error.response.data);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const joinClass = async (classCode) => {
    try {
      const res = await joinClassRequest(classCode);
      return res.data;
    } catch (error) {
      console.log('Error during join class request:', error);
      setError(error.response.data);
      throw error;
    }
  };

  const leaveClass = async (classId) => {
    try {
      const res = await leaveClassRequest(classId);
      return res.data;
    } catch (error) {
      console.log('Error during leave class request:', error);
      setError(error.response.data);
      throw error;
    }
  };

  const deleteClass = async (classId) => {
    try {
      setIsDeleting(true);
      const res = await deleteClassRequest(classId);
      setClasses((prevClasses) =>
        prevClasses.filter((c) => c.class_id !== classId)
      );
      setIsDeleting(false);
      return res.data;
    } catch (error) {
      console.log('Error during delete class request:', error);
      setError(error.response.data);
      setIsDeleting(false);
      throw error;
    }
  };

  return (
    <ClassContext.Provider
      value={{
        clearError,
        classes,
        getClasses,
        createClass,
        joinClass,
        error,
        isLoading,
        setClasses,
        leaveClass,
        deleteClass,
        isCreating,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export { ClassProvider, useClass };
