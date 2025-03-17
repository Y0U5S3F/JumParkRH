import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const ABSENCE_API_URL = "http://127.0.0.1:8000/api/absence/absences/";

// Helper function to get the token from local storage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

// Fetch all absences
export const fetchAbsences = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(ABSENCE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching absences:", error);
    throw error;
  }
};

// Fetch a single absence by ID
export const fetchAbsenceById = async (absenceId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(`${ABSENCE_API_URL}${absenceId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching absence:", error);
    throw error;
  }
};

// Add a new absence
export const addAbsence = async (absenceData) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.post(ABSENCE_API_URL, absenceData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding absence:", error);
    throw error;
  }
};

// Update an existing absence
export const updateAbsence = async (absenceId, updatedAbsence) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.put(`${ABSENCE_API_URL}${absenceId}/`, updatedAbsence, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating absence:", error);
    throw error;
  }
};

// Delete an absence
export const deleteAbsence = async (absenceId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    await axios.delete(`${ABSENCE_API_URL}${absenceId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
  } catch (error) {
    console.error("Error deleting absence:", error);
    throw error;
  }
};