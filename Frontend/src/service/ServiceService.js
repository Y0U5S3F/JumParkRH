import axios from "axios";

const SERVICE_API_URL = "http://127.0.0.1:8000/api/service/services/";

export const fetchServices = async () => {
    try {
      const response = await axios.get(SERVICE_API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  };