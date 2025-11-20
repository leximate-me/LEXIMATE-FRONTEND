import axios from 'axios';

const instance = axios.create({
  baseURL:'http://localhost/api',
  withCredentials: true,
});

export default instance;

