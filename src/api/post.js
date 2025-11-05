import axios from './axios';

const getPostsRequest = async (classId) => {
  try {
    const response = await axios.get(`course/${classId}/post`);
    return response;
  } catch (error) {
    console.error('Error during get posts request:', error);
    throw error;
  }
};

const getPostByIdRequest = async (classId, postId) => {
  try {
    const response = await axios.get(`course/${classId}/post/${postId}`);
    return response;
  } catch (error) {
    console.error('Error during get post by id request:', error);
    throw error;
  }
};

const createPostRequest = async (classId, post) => {
  try {
    const response = await axios.post(`course/${classId}/post`, post);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error during create post request:', error);
    throw error;
  }
};

const deletePostRequest = async (classId, postId) => {
  try {
    const response = await axios.delete(`course/${classId}/post/${postId}`);
    return response;
  } catch (error) {
    console.error('Error during delete post request:', error);
    throw error;
  }
};

const getCommentsRequest = async (classId, postId) => {
  try {
    const response = await axios.get(`course/${classId}/post/${postId}/comment`);
    return response;
  } catch (error) {
    console.error('Error during get comments request:', error);
    throw error;
  }
};

const createCommentRequest = async (classId, postId, content) => {
  try {
    const response = await axios.post(`course/${classId}/post/${postId}/comment`, { content });
    return response;
  } catch (error) {
    console.error('Error during create comment request:', error);
    throw error;
  }
  
};

const deleteCommentRequest = async (classId, postId, commentId) => {
  try {
    const response = await axios.delete(`course/${classId}/post/${postId}/comment/${commentId}`);
    return response;
  } catch (error) {
    console.error('Error during delete comment request:', error);
    throw error;
  }
};

export {
  createPostRequest,
  getPostsRequest,
  deletePostRequest,
  getPostByIdRequest,
  createCommentRequest,
  getCommentsRequest,
  deleteCommentRequest,
};