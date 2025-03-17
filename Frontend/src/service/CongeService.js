import axios from "axios";
import { fetchEmployeeMinimalByMatricule } from "./EmployeService";
import { fetchTypeCongeById } from "./TypeCongeService";
import { ACCESS_TOKEN } from "../constants";

const CONGE_API_URL = "http://127.0.0.1:8000/api/conge/conges/";

// Helper function to get the token from local storage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

// Fetch all congés with employee names
export const fetchConges = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(CONGE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    const conges = response.data;

    // Fetch employee names and typeConge names for each congé
    const congesWithDetails = await Promise.all(
      conges.map(async (conge) => {
        const employee = await fetchEmployeeMinimalByMatricule(conge.employe); // Fetch employee details
        const typeConge = await fetchTypeCongeById(conge.typeconge); // Fetch typeConge name
        
        return {
          ...conge,
          employe_name: `${employee.nom} ${employee.prenom}`,
          typeConge_nom: typeConge.nom,
        };
      })
    );

    return congesWithDetails;
  } catch (error) {
    console.error("Error fetching congés:", error);
    throw error;
  }
};

// Add a new congé
export const addConge = async (congeData) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.post(CONGE_API_URL, congeData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding congé:", error);
    throw error;
  }
};

// Update an existing congé
export const updateConge = async (congeId, updatedConge) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.put(`${CONGE_API_URL}${congeId}/`, updatedConge, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating congé:", error);
    throw error;
  }
};

// Delete a congé
export const deleteConge = async (congeId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    await axios.delete(`${CONGE_API_URL}${congeId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
  } catch (error) {
    console.error("Error deleting congé:", error);
    throw error;
  }
};