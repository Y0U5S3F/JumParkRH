import axios from "axios";

const ABSENCE_API_URL = "http://127.0.0.1:8000/api/absence/absences/";

// Fetch all absences
export const fetchAbsences = async () => {
  try {
    const response = await axios.get(ABSENCE_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching absences:", error);
    throw error;
  }
};

// Fetch a single absence by ID
export const fetchAbsenceById = async (absenceId) => {
  try {
    const response = await axios.get(`${ABSENCE_API_URL}${absenceId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching absence:", error);
    throw error;
  }
};

// Add a new absence
export const addAbsence = async (absenceData) => {
  try {
    const response = await axios.post(ABSENCE_API_URL, absenceData);
    return response.data;
  } catch (error) {
    console.error("Error adding absence:", error);
    throw error;
  }
};

// Update an existing absence
export const updateAbsence = async (absenceId, updatedAbsence) => {
  try {
    const response = await axios.put(`${ABSENCE_API_URL}${absenceId}/`, updatedAbsence);
    return response.data;
  } catch (error) {
    console.error("Error updating absence:", error);
    throw error;
  }
};

// Delete an absence
export const deleteAbsence = async (absenceId) => {
  try {
    await axios.delete(`${ABSENCE_API_URL}${absenceId}/`);
  } catch (error) {
    console.error("Error deleting absence:", error);
    throw error;
  }
};