import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Base URL dari .env
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Tambah token ke setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      // Handle 401 Unauthorized - redirect to login
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Handle 403 Forbidden
      if (status === 403) {
        console.error('Access denied:', data.message);
      }
      
      // Return error data
      return Promise.reject(data);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        success: false,
        message: 'Server tidak merespon. Pastikan backend sudah running.',
      });
    } else {
      // Error in request setup
      return Promise.reject({
        success: false,
        message: error.message,
      });
    }
  }
);

// Helper functions
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default apiClient;
