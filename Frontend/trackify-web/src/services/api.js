import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7240',
});

api.interceptors.request.use((config) => {
  console.log('Request:', config);
  return config;
});

export default api;

