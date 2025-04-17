import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Your API URL
});

// Get token from sessionStorage or localStorage
const getToken = (key) => sessionStorage.getItem(key) || localStorage.getItem(key);

// Save token to both storages
const setToken = (key, value) => {
  sessionStorage.setItem(key, value);
  localStorage.setItem(key, value);
};

// Function to refresh token
const refreshAccessToken = async () => {
  const refreshToken = getToken(REFRESH_TOKEN);
  if (!refreshToken) return null; // No refresh token available

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh/`, { refresh: refreshToken });
    const newAccessToken = response.data.access;
    setToken(ACCESS_TOKEN, newAccessToken);
    return newAccessToken;
  } catch (error) {
    return null;
  }
};

// Request interceptor: Ensures access token is present or refreshes it
api.interceptors.request.use(
  async (config) => {
    let token = getToken(ACCESS_TOKEN);
    
    if (!token) {
      // If no access token, try to refresh it
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Automatically refresh access token on 401 errors
api.interceptors.response.use(
  (response) => response, // Return response if successful
  async (error) => {
    const originalRequest = error.config;

    // If the request failed due to an expired access token, try refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loops

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry the original request with new token
      }
    }

    return Promise.reject(error); // If refresh fails, return error
  }
);

export default api;
