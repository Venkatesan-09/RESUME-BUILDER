// import axios from 'axios'

// const api = axios.create({
//     baseURL : import.meta.env.VITE_BASE_URL
// })

// export default api

// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
   headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || ''; // Or get from your Redux store
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;