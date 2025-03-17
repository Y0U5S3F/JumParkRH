import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const DASHBOARD_API_URL = "http://127.0.0.1:8000/api/absence/dashboard/";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN);
};

// Fetch dashboard data
export const fetchDashboardData = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(DASHBOARD_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};