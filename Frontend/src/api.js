import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Your API URL
});

const getToken = (key) => {
  return sessionStorage.getItem(key) || localStorage.getItem(key);
};

const setToken = (key, value) => {
  sessionStorage.setItem(key, value);
  localStorage.setItem(key, value);
};

api.interceptors.request.use(
  async (config) => {
    let token = getToken(ACCESS_TOKEN); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    } else {
      const refreshToken = getToken(REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh/`, { refresh: refreshToken });
          token = response.data.access;
          setToken(ACCESS_TOKEN, token);
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;