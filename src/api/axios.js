import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://leximate-backend.onrender.com/api',
  withCredentials: true,
});

export default instance;
