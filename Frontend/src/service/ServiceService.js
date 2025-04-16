import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const SERVICE_API_URL = "http://127.0.0.1:8000/api/service/services/";

// Helper function to get the token from local storage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

// Fetch all services with token
export const fetchServices = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(SERVICE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add a new service with token
export const addService = async (serviceData) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.post(SERVICE_API_URL, serviceData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an existing service by ID with token
export const updateService = async (serviceId, updatedService) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.put(`${SERVICE_API_URL}${serviceId}/`, updatedService, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a service by ID with token
export const deleteService = async (serviceId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    await axios.delete(`${SERVICE_API_URL}${serviceId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
  } catch (error) {
    throw error;
  }
};