import axios from './axios';

const getPostsRequest = async (classId) => {
  try {
    const response = await axios.get(`/class/${classId}/post`);
    return response;
  } catch (error) {
    console.error('Error during get posts request:', error);
    throw error;
  }
};

const getPostByIdRequest = async (classId, postId) => {
  try {
    const response = await axios.get(`/class/${classId}/post/${postId}`);
    return response;
  } catch (error) {
    console.error('Error during get post by id request:', error);
    throw error;
  }
};

const createPostRequest = async (classId, post) => {
  try {
    const response = await axios.post(`/class/${classId}/post`, post);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error during create post request:', error);
    throw error;
  }
};

const deletePostRequest = async (classId, postId) => {
  try {
    const response = await axios.delete(`/class/${classId}/post/${postId}`);
    return response;
  } catch (error) {
    console.error('Error during delete post request:', error);
    throw error;
  }
};

export {
  createPostRequest,
  getPostsRequest,
  deletePostRequest,
  getPostByIdRequest,
};