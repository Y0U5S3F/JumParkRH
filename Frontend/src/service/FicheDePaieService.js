import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const SALAIRE_API_URL = "http://127.0.0.1:8000/api/salaire/options/";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

export const fetchEmployeeSalaryInfo = async (matricule) => {
  try {
    const token = getAccessToken();
    const response = await axios.get(`${SALAIRE_API_URL}${matricule}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};