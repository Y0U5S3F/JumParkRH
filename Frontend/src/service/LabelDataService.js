import axios from "axios";

const LABEL_DATA_API_URL = "http://127.0.0.1:8000/api/label/labels/";

// Fetch all labels
export const fetchLabels = async () => {
  try {
    const response = await axios.get(LABEL_DATA_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching labels:", error);
    throw error;
  }
};

// Fetch a single label by ID
export const fetchLabelById = async (labelId) => {
  try {
    const response = await axios.get(`${LABEL_DATA_API_URL}${labelId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching label:", error);
    throw error;
  }
};

// Add a new label with matricule
export const addLabel = async (matricule, labelData) => {
  try {
    const response = await axios.post(`${LABEL_DATA_API_URL}${matricule}/`, labelData);
    return response.data;
  } catch (error) {
    console.error("Error adding label:", error);
    throw error;
  }
};

// Update an existing label
export const updateLabel = async (labelId, updatedLabel) => {
  try {
    const response = await axios.put(`http://127.0.0.1:8000/api/label/labels/data/${labelId}/`, updatedLabel);
    return response.data;
  } catch (error) {
    console.error("Error updating label:", error);
    throw error;
  }
};

// Delete a label
export const deleteLabel = async (labelId) => {
  try {
    await axios.delete(`${LABEL_DATA_API_URL}${labelId}/`);
  } catch (error) {
    console.error("Error deleting label:", error);
    throw error;
  }
};