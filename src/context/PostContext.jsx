import { createContext, useContext, useState } from 'react';
import {
  getPostsRequest,
  createPostRequest,
  deletePostRequest,
  getPostByIdRequest,
  createCommentRequest,
  getCommentsRequest,
  deleteCommentRequest,
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
  const [commentsByPost, setCommentsByPost] = useState({}); // Comentarios organizados por postId

  const clearError = () => {
    setError(null);
  };

  const getPosts = async (classId) => {
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
        delete updated[postId]; // Eliminar comentarios asociados al post eliminado
        return updated;
      });
    } catch (error) {
      console.error('Error during delete post request:', error);
      setError(error.response?.data || 'Error deleting post');
    }
  };

  const getPostById = async (classId, postId) => {
    setIsLoading(true);
    try {
      const res = await getPostByIdRequest(classId, postId);
      return res.data;
    } catch (error) {
      console.error('Error during get post by id request:', error);
      setError(error.response?.data || 'Error fetching post');
    } finally {
      setIsLoading(false);
    }
  };

  const getComments = async (classId, postId) => {
    setIsLoading(true);
    try {
      const res = await getCommentsRequest(classId, postId);
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: res.data,
      }));
    } catch (error) {
      console.error('Error during get comments request:', error);
      setError(error.response?.data || 'Error fetching comments');
    } finally {
      setIsLoading(false);
    }
  };

  const createComment = async (classId, postId, comment) => {
    try {
      const res = await createCommentRequest(classId, postId, comment);
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data],
      }));
    } catch (error) {
      console.error('Error during create comment request:', error);
      setError(error.response?.data || 'Error creating comment');
    }
  };

  const deleteComment = async (classId, postId, commentId) => {
    try {
      await deleteCommentRequest(classId, postId, commentId);
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: prev[postId]?.filter((c) => c.id !== commentId),
      }));
    } catch (error) {
      console.error('Error during delete comment request:', error);
      setError(error.response?.data || 'Error deleting comment');
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
        commentsByPost,
        getComments,
        deleteComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export { PostProvider, usePost };
