import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const DASHBOARD_API_URL = "http://127.0.0.1:8000/api/absence/dashboard/";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

export const fetchDashboardData = async () => {
  try {
    const token = getAccessToken();
    const response = await axios.get(DASHBOARD_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};