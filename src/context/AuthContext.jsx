import { createContext, useState, useContext, useEffect } from 'react';
import {
  registerRequest,
  loginRequest,
  verifyToken,
  logoutRequest,
  verifyEmailRequest,
} from '../api/auth';

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const signUp = async (user) => {
    try {
      await registerRequest(user);
      await updateUserFromToken();
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data);
    }
  };

  const signIn = async (user) => {
    try {
      await loginRequest(user);
      await updateUserFromToken();
    } catch (error) {
      console.log('context', error);
      setError(error.response.data);
    }
  };

  const logOut = async () => {
    try {
      await logoutRequest();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  const verifyEmail = async () => {
    try {
      await verifyEmailRequest();
      await updateUserFromToken();
      console.log('estoy en el try de context');
    } catch (error) {
      console.log(error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const updateUserFromToken = async () => {
    try {
      const res = await verifyToken();
      if (!res.data) {
        setIsAuthenticated(false);
        setLoading(false);
        setUser(null);
        return;
      }
      setIsAuthenticated(true);
      setUser(res.data);
      setLoading(false);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    updateUserFromToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signUp,
        user,
        isAuthenticated,
        error,
        signIn,
        loading,
        logOut,
        clearError,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
