import axios from "axios";

const JOUR_FERIE_API_URL = "http://127.0.0.1:8000/api/jourferie/jourferies/";

// Fetch all jour feries
export const fetchJourFeries = async () => {
  try {
    const response = await axios.get(JOUR_FERIE_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching jour feries:", error);
    throw error;
  }
};

// Fetch a single jour ferie by ID
export const fetchJourFerieById = async (jourFerieId) => {
  try {
    const response = await axios.get(`${JOUR_FERIE_API_URL}${jourFerieId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching jour ferie:", error);
    throw error;
  }
};

// Add a new jour ferie
export const addJourFerie = async (jourFerieData) => {
  try {
    const response = await axios.post(JOUR_FERIE_API_URL, jourFerieData);
    return response.data;
  } catch (error) {
    console.error("Error adding jour ferie:", error);
    throw error;
  }
};

// Update an existing jour ferie
export const updateJourFerie = async (jourFerieId, updatedJourFerie) => {
  try {
    const response = await axios.put(`${JOUR_FERIE_API_URL}${jourFerieId}/`, updatedJourFerie);
    return response.data;
  } catch (error) {
    console.error("Error updating jour ferie:", error);
    throw error;
  }
};

// Delete a jour ferie
export const deleteJourFerie = async (jourFerieId) => {
  try {
    await axios.delete(`${JOUR_FERIE_API_URL}${jourFerieId}/`);
  } catch (error) {
    console.error("Error deleting jour ferie:", error);
    throw error;
  }
};