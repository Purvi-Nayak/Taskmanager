import axios from "axios";
import { store } from '../redux/store';
import { METHODS } from "../constant";

// API URL configuration for development and production
// Use /api for production (Vercel) or if we're not on localhost
const API_URL = process.env.NODE_ENV === 'production' ||
  (typeof window !== 'undefined' && !window.location.hostname.includes('localhost'))
  ? '/api'
  : 'http://localhost:3000';

console.log('API_URL:', API_URL); // Debug log

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});
// In api/index.jsx
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state?.users?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      store.dispatch({ type: 'users/logout' });
    }
    return Promise.reject(error);
  }
);

const client = ({ method = METHODS.GET, url = '', withCredentials = false, auth, data, ...otherParams }) => {
  return api({
    method,
    url,
    withCredentials,
    auth,
    data,
    ...otherParams
  });
}

export default client;