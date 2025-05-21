import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const SERVICE_API_URL = "http://127.0.0.1:8000/api/service/services/";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

export const fetchServices = async () => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(SERVICE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addService = async (serviceData) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.post(SERVICE_API_URL, serviceData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateService = async (serviceId, updatedService) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.put(`${SERVICE_API_URL}${serviceId}/`, updatedService, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteService = async (serviceId) => {
  try {
    const token = getAccessToken(); 
    await axios.delete(`${SERVICE_API_URL}${serviceId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
  } catch (error) {
    throw error;
  }
};