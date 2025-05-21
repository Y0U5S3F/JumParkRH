import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

const getToken = (key) => sessionStorage.getItem(key) || localStorage.getItem(key);

const setToken = (key, value) => {
  sessionStorage.setItem(key, value);
  localStorage.setItem(key, value);
};

const refreshAccessToken = async () => {
  const refreshToken = getToken(REFRESH_TOKEN);
  if (!refreshToken) return null; 

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh/`, { refresh: refreshToken });
    const newAccessToken = response.data.access;
    setToken(ACCESS_TOKEN, newAccessToken);
    return newAccessToken;
  } catch (error) {
    return null;
  }
};

api.interceptors.request.use(
  async (config) => {
    let token = getToken(ACCESS_TOKEN);
    
    if (!token) {
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

api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); 
      }
    }

    return Promise.reject(error); 
  }
);

export default api;
