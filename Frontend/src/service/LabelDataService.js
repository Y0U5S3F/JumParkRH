import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const LABEL_DATA_API_URL = "http://127.0.0.1:8000/api/label/labels/";

// Helper function to get the token from local storage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN);
};

// Fetch all labels with token
export const fetchLabels = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(LABEL_DATA_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching labels:", error);
    throw error;
  }
};

// Fetch labels with streaming support and token
export const fetchLabelsStream = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(`${LABEL_DATA_API_URL}?stream=true`, {
      responseType: "stream", // Ensure the response is treated as a stream
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response; // Return the raw response for streaming
  } catch (error) {
    console.error("Error fetching labels with streaming:", error);
    throw error;
  }
};
// Fetch a single label by ID with token
export const fetchLabelById = async (labelId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(`${LABEL_DATA_API_URL}${labelId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching label:", error);
    throw error;
  }
};

// Add a new label with matricule and token
export const addLabel = async (matricule, labelData) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.post(
      `${LABEL_DATA_API_URL}${matricule}/`,
      labelData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the headers
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding label:", error);
    throw error;
  }
};

// Update an existing label with token
export const updateLabel = async (labelId, updatedLabel) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.put(
      `${LABEL_DATA_API_URL}data/${labelId}/`,
      updatedLabel,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the headers
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating label:", error);
    throw error;
  }
};

// Delete a label with token
export const deleteLabel = async (labelId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    await axios.delete(`${LABEL_DATA_API_URL}data/${labelId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    console.log(`Deleted label with ID: ${labelId}`);
  } catch (error) {
    console.error("Error deleting label:", error);
    throw error;
  }
};