import { createContext, useState, useContext } from 'react';
import {
  registerRequest,
  loginRequest,
  verifyToken,
  logoutRequest,
} from '../api/auth';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

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
      const res = await registerRequest(user);
      setIsAuthenticated(true);
      setUser(res.data);
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data);
    }
  };

  const signIn = async (user) => {
    try {
      const res = await loginRequest(user);
      setIsAuthenticated(true);
      setUser(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data);
    }
  };

  const logOut = async () => {
    try {
      await logoutRequest();
      Cookies.remove('token');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (error !== null) {
  //     const timer = setTimeout(() => {
  //       setError(null);
  //     }, 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [error]);

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await verifyToken(cookies.token);
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
        console.log(error);
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }
    checkLogin();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
