import axios from "axios";
import { fetchEmployeeMinimalByMatricule } from "./EmployeService";
import { fetchTypeCongeById } from "./TypeCongeService";
import { ACCESS_TOKEN } from "../constants";

const CONGE_API_URL = "http://127.0.0.1:8000/api/conge/conges/";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

export const fetchConges = async () => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(CONGE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    const conges = response.data;

    const congesWithDetails = await Promise.all(
      conges.map(async (conge) => {
        const employee = await fetchEmployeeMinimalByMatricule(conge.employe); 
        const typeConge = await fetchTypeCongeById(conge.typeconge); 
        
        return {
          ...conge,
          employe_name: `${employee.nom} ${employee.prenom}`,
          typeConge_nom: typeConge.nom,
        };
      })
    );

    return congesWithDetails;
  } catch (error) {
    throw error;
  }
};

export const addConge = async (congeData) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.post(CONGE_API_URL, congeData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateConge = async (congeId, updatedConge) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.put(`${CONGE_API_URL}${congeId}/`, updatedConge, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteConge = async (congeId) => {
  try {
    const token = getAccessToken(); 
    await axios.delete(`${CONGE_API_URL}${congeId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
  } catch (error) {
    throw error;
  }
};