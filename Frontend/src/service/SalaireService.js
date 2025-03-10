import axios from "axios";

const SALAIRE_API_URL = "http://127.0.0.1:8000/api/salaire/salaires/";

// Fetch all salaires
export const fetchSalaires = async () => {
  try {
    const response = await axios.get(SALAIRE_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching salaires:", error);
    throw error;
  }
};

// Fetch a single salaire by ID
export const fetchSalaireById = async (salaireId) => {
  try {
    const response = await axios.get(`${SALAIRE_API_URL}${salaireId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching salaire:", error);
    throw error;
  }
};

// Add a new salaire
export const addSalaire = async (salaireData) => {
  try {
    const response = await axios.post(SALAIRE_API_URL, salaireData);
    return response.data;
  } catch (error) {
    console.error("Error adding salaire:", error);
    throw error;
  }
};

// Update an existing salaire
export const updateSalaire = async (salaireId, updatedSalaire) => {
  try {
    const response = await axios.put(`${SALAIRE_API_URL}${salaireId}/`, updatedSalaire);
    return response.data;
  } catch (error) {
    console.error("Error updating salaire:", error);
    throw error;
  }
};

// Delete a salaire
export const deleteSalaire = async (salaireId) => {
  try {
    await axios.delete(`${SALAIRE_API_URL}${salaireId}/`);
  } catch (error) {
    console.error("Error deleting salaire:", error);
    throw error;
  }
};