import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getPostsRequest,
  createPostRequest,
  deletePostRequest,
  getPostByIdRequest,
  createCommentRequest,
  getCommentsRequest,
  deleteCommentRequest,
} from '../api/post';
import { useWebSocketContext } from './WebSocketContext'; // IMPORTAR WEBSOCKET CONTEXT

const PostContext = createContext();

const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [commentsByPost, setCommentsByPost] = useState({});
  
  // OBTENER FUNCIONES DE WEBSOCKET
  const { on, off } = useWebSocketContext();

  const clearError = () => {
    setError(null);
  };

  const getPosts = useCallback(async (classId) => {
    setIsLoading(true);
    try {
      const res = await getPostsRequest(classId);
      setPosts(res.data);
    } catch (error) {
      console.error('Error during get posts request:', error);
      setError(error.response?.data || 'Error fetching posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getComments = async (classId, postId) => {
    try {
      const res = await getCommentsRequest(classId, postId);
      setCommentsByPost((prev) => ({ ...prev, [postId]: res.data }));
    } catch (error) {
      console.error('Error during get comments request:', error);
      setError(error.response?.data || 'Error fetching comments');
    }
  };

  const createPost = async (classId, post) => {
    setIsCreating(true);
    try {
      const res = await createPostRequest(classId, post);
      setPosts((prevPosts) => [...prevPosts, res.data]);
    } catch (error) {
      console.error('Error during create post request:', error);
      setError(error.response?.data || 'Error creating post');
    } finally {
      setIsCreating(false);
    }
  };

  const deletePost = async (classId, postId) => {
    try {
      await deletePostRequest(classId, postId);
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
      setCommentsByPost((prev) => {
        const updated = { ...prev };
        delete updated[postId];
        return updated;
      });
    } catch (error) {
      console.error('Error during delete post request:', error);
      setError(error.response?.data || 'Error deleting post');
    }
  };

  const createComment = async (classId, postId, content) => {
    try {
      // Esta función sigue la ruta API, que a su vez debe activar la señal de WebSocket
      const res = await createCommentRequest(classId, postId, content);
      
      // La actualización de commentsByPost SÓLO debe ocurrir si el servidor NO está enviando
      // el mensaje de WebSocket de vuelta al mismo cliente (loopback).
      // Si el servidor envía el mensaje de vuelta al cliente que lo creó (loopback),
      // el useEffect de abajo manejará la actualización, evitando duplicados.
      
      // Si el servidor NO hace loopback, descomenta esta línea:
      /*
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data],
      }));
      */
    } catch (error) {
      console.error('Error during create comment request:', error);
      setError(error.response?.data || 'Error creating comment');
    }
  };

  const getPostById = async (classId, postId) => {
    try {
      const res = await getPostByIdRequest(classId, postId);
      return res.data;
    } catch (error) {
      console.error('Error during get post by id request:', error);
      setError(error.response?.data || 'Error fetching post');
    }
  };
  
  const deleteComment = async (classId, postId, commentId) => {
    try {
      await deleteCommentRequest(classId, postId, commentId);
      // La eliminación también será manejada por el useEffect de WebSocket para sincronización
    } catch (error) {
      console.error('Error during delete comment request:', error);
      setError(error.response?.data || 'Error deleting comment');
    }
  };

  // NUEVO: Manejo de eventos de WebSocket para comentarios
  useEffect(() => {
    const handleCommentCreated = (data) => {
      // Mapear 'author' a 'user' para estructura de renderizado
      const newComment = {
        ...data,
        user: data.author || data.user, 
      };
      const postId = newComment.postId;

      setCommentsByPost((prev) => {
        const currentComments = prev[postId] || [];
        
        // Evitar duplicados (esencial para clientes con y sin loopback)
        if (currentComments.some((c) => c.id === newComment.id)) {
          return prev;
        }

        return {
          ...prev,
          [postId]: [newComment, ...currentComments], // Añade el nuevo comentario al inicio
        };
      });
    };

    const handleCommentDeleted = (data) => {
      const deletedId = data.commentId || data.id || data;
      const postId = data.postId;

      if (!postId) return; // Necesitamos el postId para saber qué array actualizar

      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== deletedId),
      }));
    };

    // Suscribirse a los eventos
    on('comment_created', handleCommentCreated);
    on('comment_deleted', handleCommentDeleted);

    
    // Limpieza al desmontar
    return () => {
      off('comment_created', handleCommentCreated);
      off('comment_deleted', handleCommentDeleted);
    };
  }, [on, off]); // Depende de las funciones de WebSocket

  return (
    <PostContext.Provider
      value={{
        posts,
        getPosts,
        createPost,
        isCreating,
        error,
        clearError,
        deletePost,
        isLoading,
        commentsByPost,
        getComments,
        createComment,
        getPostById,
        deleteComment,
        setPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export { PostProvider, usePost };