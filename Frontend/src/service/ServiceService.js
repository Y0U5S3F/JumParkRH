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

  export const addService = async (serviceData) => {
    try {
      const response = await axios.post(SERVICE_API_URL, serviceData);
      return response.data;
    } catch (error) {
      console.error("Error adding service:", error);
      throw error;
    }
  };

  export const updateService = async (serviceId, updatedService) => {
    try {
      const response = await axios.put(`${SERVICE_API_URL}${serviceId}/`, updatedService);
      return response.data;
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  };
  
  