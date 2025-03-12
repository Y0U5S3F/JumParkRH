import axios from "axios";

const DASHBOARD_API_URL = "http://127.0.0.1:8000/api/absence/dashboard/";

// Fetch dashboard data
export const fetchDashboardData = async () => {
  try {
    const response = await axios.get(DASHBOARD_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};