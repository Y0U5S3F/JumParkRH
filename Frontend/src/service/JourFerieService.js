import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const JOUR_FERIE_API_URL = "http://127.0.0.1:8000/api/jourferie/jourferies/";

// Helper function to get the token from local storage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

// Fetch all jour feries
export const fetchJourFeries = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(JOUR_FERIE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a single jour ferie by ID
export const fetchJourFerieById = async (jourFerieId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(`${JOUR_FERIE_API_URL}${jourFerieId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add a new jour ferie
export const addJourFerie = async (jourFerieData) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.post(JOUR_FERIE_API_URL, jourFerieData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an existing jour ferie
export const updateJourFerie = async (jourFerieId, updatedJourFerie) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.put(`${JOUR_FERIE_API_URL}${jourFerieId}/`, updatedJourFerie, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a jour ferie
export const deleteJourFerie = async (jourFerieId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    await axios.delete(`${JOUR_FERIE_API_URL}${jourFerieId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
  } catch (error) {
    throw error;
  }
};