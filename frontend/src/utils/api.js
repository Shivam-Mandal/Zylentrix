import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// If VITE_API_URL is set, use it; otherwise rely on Vite dev proxy and use relative /api
const baseURL = API_URL ? API_URL.replace(/\/$/, '') + '/api' : '/api';

const instance = axios.create({
  baseURL,
  withCredentials: true // Important for sending cookies
});

// Add a response interceptor for handling token expiration
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and it's not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await instance.post('/auth/refresh');
        // Retry the original request
        return instance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;