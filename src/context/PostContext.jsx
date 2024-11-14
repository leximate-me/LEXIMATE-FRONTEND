import { createContext, useContext, useState } from 'react';
import {
  getPostsRequest,
  createPostRequest,
  deletePostRequest,
  getPostByIdRequest,
  createCommentRequest,
  getCommentsRequest,
} from '../api/post';

const PostContext = createContext();

const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

const PostProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);

  const clearError = () => {
    setError(null);
  };

  const getPosts = async (classId) => {
    setIsLoading(true); // Inicia loading cuando comenzamos a obtener posts
    try {
      const res = await getPostsRequest(classId);
      setPosts(res.data);
    } catch (error) {
      console.error('Error during get posts request:', error);
      setError(error.response?.data || 'Error fetching posts');
    } finally {
      setIsLoading(false); // Se asegura de cambiar el estado al final de la operación
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
    } catch (error) {
      console.error('Error during delete post request:', error);
      setError(error.response?.data || 'Error deleting post');
    }
  };

  const getPostById = async (classId, postId) => {
    setIsLoading(true); // Marca el loading cuando se obtiene el post
    try {
      const res = await getPostByIdRequest(classId, postId);
      return res.data;
    } catch (error) {
      console.error('Error during get post by id request:', error);
      setError(error.response?.data || 'Error fetching post');
    } finally {
      setIsLoading(false); // Termina el loading una vez completada la operación
    }
  };

  const getComments = async (classId, postId) => {
    setIsLoading(true); // Marca el loading cuando se obtiene los comentarios
    try {
      const res = await getCommentsRequest(classId, postId);
      setComments(res.data);
    } catch (error) {
      console.error('Error during get comments request:', error);
      setError(error.response?.data || 'Error fetching comments');
    } finally {
      setIsLoading(false); // Termina el loading cuando se obtienen los comentarios
    }
  };

  const createComment = async (classId, postId, comment) => {
    try {
      const res = await createCommentRequest(classId, postId, comment);
      setComments((prevComments) => [...prevComments, res.data]);
    } catch (error) {
      console.error('Error during create comment request:', error);
      setError(error.response?.data || 'Error creating comment');
    }
  };

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
        getPostById,
        createComment,
        comments,
        getComments,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export { PostProvider, usePost };
