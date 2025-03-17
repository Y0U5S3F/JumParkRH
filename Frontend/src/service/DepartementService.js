import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const DEPARTMENT_API_URL = "http://127.0.0.1:8000/api/departement/departements/";

// Helper function to get the token from local storage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN);
};

// Fetch all departments with token
export const fetchDepartements = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(DEPARTMENT_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

// Update a department by ID with token
export const updateDepartement = async (id, departementData) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.put(`${DEPARTMENT_API_URL}${id}/`, departementData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};

// Add a new department with token
export const addDepartment = async (departmentData) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.post(DEPARTMENT_API_URL, departmentData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
};

// Delete a department by ID with token
export const deleteDepartment = async (id) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    await axios.delete(`${DEPARTMENT_API_URL}${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    console.log(`Deleted department with ID: ${id}`);
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};