import axios from "axios";
import {fetchEmployeeMinimalByMatricule} from "./EmployeService";
const CONGE_API_URL = "http://127.0.0.1:8000/api/conge/conges/";

// Fetch all congés with employee names
export const fetchConges = async () => {
  try {
    const response = await axios.get(CONGE_API_URL);
    const conges = response.data;

    // Fetch employee names for each congé
    const congesWithNames = await Promise.all(
      conges.map(async (conge) => {
        const employee = await fetchEmployeeMinimalByMatricule(conge.employe); // Assuming `employe` contains the matricule
        return {
          ...conge,
          employe_name: `${employee.nom} ${employee.prenom}`,
        };
      })
    );

    return congesWithNames;
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
