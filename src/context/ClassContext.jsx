import { createContext, useState, useContext } from 'react';
import { getClassesRequest, createClassesRequest, joinClassRequest } from '../api/class';
import { set } from 'react-hook-form';

const ClassContext = createContext();

const useClass = () => {
  const context = useContext(ClassContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

const ClassProvider = ({ children }) => {

  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearError = () => {
    setError(null);
  };

  const getClasses = async () => {

    try {
      const res = await getClassesRequest();
      setClasses(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log('Error during get classes request:', error.response.data.error);
      setError(error.response.data);
      setIsLoading(false);
      throw error;
    }

  }

  const createClass = async (newClass) => {

    try {
      const res = await createClassesRequest(newClass);
      return res.data;
    } catch (error) {
      console.log('Error during create class request:', error.response.data);
      setError(error.response.data);
      throw error;
    }

  }
  const joinClass = async (classCode) => {

    try {
      const res = await joinClassRequest(classCode);
      return res.data;
    } catch (error) {
      console.log('Error during create class request:', error);
      setError(error.response.data);
      throw error;
    }

  }



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
      }}
    >
      {children}
    </ClassContext.Provider>
  );

}

export { ClassProvider, useClass };