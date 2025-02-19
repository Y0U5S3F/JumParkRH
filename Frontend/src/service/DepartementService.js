import axios from "axios";


const DEPARTMENT_API_URL = "http://127.0.0.1:8000/api/departement/departements/";

export const fetchDepartements = async () => {
    try {
      const response = await axios.get(DEPARTMENT_API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  };
  
  export const updateDepartement = async (id, departementData) => {
    try {
      const response = await axios.put(`${DEPARTMENT_API_URL}${id}/`, departementData);
      return response.data;
    } catch (error) {
      console.error("Error updating department:", error);
      throw error;
    }
  };
  