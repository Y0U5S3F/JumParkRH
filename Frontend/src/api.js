import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Your API URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // Get the access token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to request headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
