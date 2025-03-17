import axios from "axios";
import {  ACCESS_TOKEN } from "../constants";

const TYPE_CONGE_API_URL = "http://127.0.0.1:8000/api/typeconge/typeconge/";

// Helper function to get the token from local storage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

// Fetch all types of leave
export const fetchTypeConges = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(TYPE_CONGE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching types of leave:", error);
    throw error;
  }
};

// Fetch a single type of leave by ID
export const fetchTypeCongeById = async (typeCongeId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(`${TYPE_CONGE_API_URL}${typeCongeId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching type of leave:", error);
    throw error;
  }
};

// Add a new type of leave
export const addTypeConge = async (typeCongeData) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.post(TYPE_CONGE_API_URL, typeCongeData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response;
  } catch (error) {
    console.error("Error adding type of leave:", error);
    throw error;
  }
};

// Update an existing type of leave
export const updateTypeConge = async (typeCongeId, updatedTypeConge) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.put(
      `${TYPE_CONGE_API_URL}${typeCongeId}/`,
      updatedTypeConge,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the headers
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating type of leave:", error);
    throw error;
  }
};

// Delete a type of leave
export const deleteTypeConge = async (typeCongeId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    await axios.delete(`${TYPE_CONGE_API_URL}${typeCongeId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
  } catch (error) {
    console.error("Error deleting type of leave:", error);
    throw error;
  }
};