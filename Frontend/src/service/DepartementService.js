import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const DEPARTMENT_API_URL = "http://127.0.0.1:8000/api/departement/departements/";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

export const fetchDepartements = async () => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(DEPARTMENT_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDepartement = async (id, departementData) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.put(`${DEPARTMENT_API_URL}${id}/`, departementData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addDepartment = async (departmentData) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.post(DEPARTMENT_API_URL, departmentData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const token = getAccessToken(); 
    await axios.delete(`${DEPARTMENT_API_URL}${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
  } catch (error) {
    throw error;
  }
};