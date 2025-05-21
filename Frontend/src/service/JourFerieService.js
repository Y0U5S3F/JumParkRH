import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const JOUR_FERIE_API_URL = "http://127.0.0.1:8000/api/jourferie/jourferies/";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

export const fetchJourFeries = async () => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(JOUR_FERIE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchJourFerieById = async (jourFerieId) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(`${JOUR_FERIE_API_URL}${jourFerieId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addJourFerie = async (jourFerieData) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.post(JOUR_FERIE_API_URL, jourFerieData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateJourFerie = async (jourFerieId, updatedJourFerie) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.put(`${JOUR_FERIE_API_URL}${jourFerieId}/`, updatedJourFerie, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteJourFerie = async (jourFerieId) => {
  try {
    const token = getAccessToken(); 
    await axios.delete(`${JOUR_FERIE_API_URL}${jourFerieId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
  } catch (error) {
    throw error;
  }
};