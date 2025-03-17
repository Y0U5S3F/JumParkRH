import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const APPAREIL_API_URL = "http://127.0.0.1:8000/api/appareil/appareils/";

// Helper function to get the token from local storage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

// Fetch all appareils
export const fetchAppareils = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(APPAREIL_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appareils:", error);
    throw error;
  }
};

// Fetch a single appareil by ID
export const fetchAppareilById = async (appareilId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(`${APPAREIL_API_URL}${appareilId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appareil:", error);
    throw error;
  }
};

// Add a new appareil
export const addAppareil = async (appareilData) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.post(APPAREIL_API_URL, appareilData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding appareil:", error);
    throw error;
  }
};

// Update an existing appareil
export const updateAppareil = async (appareilId, updatedAppareil) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.put(`${APPAREIL_API_URL}${appareilId}/`, updatedAppareil, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating appareil:", error);
    throw error;
  }
};

// Delete an appareil
export const deleteAppareil = async (appareilId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    await axios.delete(`${APPAREIL_API_URL}${appareilId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
  } catch (error) {
    console.error("Error deleting appareil:", error);
    throw error;
  }
};

export const toggleAppareilStatus = async (appareilId, currentStatus) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const newStatus = currentStatus === "Connecte" ? "Non Connecte" : "Connecte";
    const response = await axios.patch(`${APPAREIL_API_URL}${appareilId}/`, { status: newStatus }, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling appareil status:", error);
    throw error;
  }
};