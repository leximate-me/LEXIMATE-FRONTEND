import { get } from 'react-hook-form';
import {
  registerRequest,
  loginRequest,
  verifyToken,
  logoutRequest,
  verifyEmailRequest,
  getProfileRequest,
  updateUserRequest,
} from '../api/auth';
import { createContext, useState, useContext, useEffect } from 'react';

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
  const [profile, setProfile] = useState(null);

  const signUp = async (user) => {
    try {
      await registerRequest(user); // Sólo realiza el registro
      await updateUserFromToken(); // Actualiza el estado del usuario
      await getProfile(); // Obtiene el perfil del usuario
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data);
    }
  };

  const signIn = async (user) => {
    try {
      await loginRequest(user);
      await updateUserFromToken();
      await getProfile();
    } catch (error) {
      console.log('context', error);
      setError(error.response.data);
    }
  };

  const logOut = async () => {
    try {
      await logoutRequest();
      setUser(null);
      setProfile(null);
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

  const getProfile = async () => {
    try {
      const res = await getProfileRequest();
      setProfile(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (data) => {
    try {
      await updateUserRequest(data);
    } catch (error) {
      console.log(error);
    }
    return profile;
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
        getProfile,
        profile,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
