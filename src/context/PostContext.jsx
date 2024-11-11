import { createContext, useContext, useState } from 'react';
import { getPostsRequest, createPostRequest, deletePostRequest, getPostByIdRequest } from '../api/post';

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

  const clearError = () => {
    setError(null);
  };

  const getPosts = async (classId) => {
    try {
      const res = await getPostsRequest(classId);
      setPosts(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error during get posts request:', error);
      setError(error.response?.data || 'Error fetching posts');
      setIsLoading(false);
      throw error;
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
      throw error;
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
      throw error;
    }
  }

  const getPostById = async (classId, postId) => {
    try {
      const res = await getPostByIdRequest(classId, postId);
      setIsLoading(false);
      return res.data;
    } catch (error) {
      console.error('Error during get post by id request:', error);
      setError(error.response?.data || 'Error fetching post');
      setIsLoading(false);
      throw error;
    }
  }

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
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export { PostProvider, usePost };