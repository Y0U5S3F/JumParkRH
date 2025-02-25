import axios from "axios";

const TYPE_CONGE_API_URL = "http://127.0.0.1:8000/api/typeconge/typeconge/";

// Fetch all types of leave
export const fetchTypeConges = async () => {
  try {
    const response = await axios.get(TYPE_CONGE_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching types of leave:", error);
    throw error;
  }
};


// Fetch a single type of leave by ID
export const fetchTypeCongeById = async (typeCongeId) => {
  try {
    const response = await axios.get(`${TYPE_CONGE_API_URL}${typeCongeId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching type of leave:", error);
    throw error;
  }
};

// Add a new type of leave
export const addTypeConge = async (typeCongeData) => {
  try {
    const response = await axios.post(TYPE_CONGE_API_URL, typeCongeData);
    return response;
  } catch (error) {
    console.error("Error adding type of leave:", error);
    throw error;
  }
};

// Update an existing type of leave
export const updateTypeConge = async (typeCongeId, updatedTypeConge) => {
  try {
    const response = await axios.put(`${TYPE_CONGE_API_URL}${typeCongeId}/`, updatedTypeConge);
    return response.data;
  } catch (error) {
    console.error("Error updating type of leave:", error);
    throw error;
  }
};

// Delete a type of leave
export const deleteTypeConge = async (typeCongeId) => {
  try {
    await axios.delete(`${TYPE_CONGE_API_URL}${typeCongeId}/`);
  } catch (error) {
    console.error("Error deleting type of leave:", error);
    throw error;
  }
};