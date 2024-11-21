import { createContext, useContext, useState, useCallback } from 'react';
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
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [commentsByPost, setCommentsByPost] = useState({});

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
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export { PostProvider, usePost };
