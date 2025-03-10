import axios from "axios";

const SALAIRE_API_URL = "http://127.0.0.1:8000/api/salaire/options/";

export const fetchEmployeeSalaryInfo = async (matricule) => {
  try {
    const response = await axios.get(`${SALAIRE_API_URL}${matricule}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee salary info:", error);
    throw error;
  }
};