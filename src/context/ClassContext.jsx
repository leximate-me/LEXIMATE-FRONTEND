import { createContext, useState, useContext } from 'react';
import { getClassesRequest } from '../api/class';

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

    const getClasses = async () => {

        try {
            const res = await getClassesRequest();
            setClasses(res.data);
        } catch (error) {
            console.log('Error during get classes request:', error);
            throw error;    
        }

    }

    return (
        <ClassContext.Provider
          value={{
            classes,
            getClasses,
          }}
        >
          {children}
        </ClassContext.Provider>
      );

}

export { ClassProvider, useClass };