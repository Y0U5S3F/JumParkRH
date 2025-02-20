import axios from "axios";

const CONGE_API_URL = "http://127.0.0.1:8000/api/conge/conges/";

// Fetch all congés
export const fetchConges = async () => {
  try {
    const response = await axios.get(CONGE_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching congés:", error);
    throw error;
  }
};

// Add a new congé
export const addConge = async (congeData) => {
  try {
    const response = await axios.post(CONGE_API_URL, congeData);
    return response.data;
  } catch (error) {
    console.error("Error adding congé:", error);
    throw error;
  }
};

// Update an existing congé
export const updateConge = async (congeId, updatedConge) => {
  try {
    const response = await axios.put(`${CONGE_API_URL}${congeId}/`, updatedConge);
    return response.data;
  } catch (error) {
    console.error("Error updating congé:", error);
    throw error;
  }
};

// Delete a congé
export const deleteConge = async (congeId) => {
  try {
    await axios.delete(`${CONGE_API_URL}${congeId}/`);
  } catch (error) {
    console.error("Error deleting congé:", error);
    throw error;
  }
};
