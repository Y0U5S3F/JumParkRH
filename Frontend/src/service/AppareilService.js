import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const APPAREIL_API_URL = "http://127.0.0.1:8000/api/appareil/appareils/";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

export const fetchAppareils = async () => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(APPAREIL_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAppareilById = async (appareilId) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(`${APPAREIL_API_URL}${appareilId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addAppareil = async (appareilData) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.post(APPAREIL_API_URL, appareilData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAppareil = async (appareilId, updatedAppareil) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.put(`${APPAREIL_API_URL}${appareilId}/`, updatedAppareil, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAppareil = async (appareilId) => {
  try {
    const token = getAccessToken(); 
    await axios.delete(`${APPAREIL_API_URL}${appareilId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
  } catch (error) {
    throw error;
  }
};

export const toggleAppareilStatus = async (appareilId, currentStatus) => {
  try {
    const token = getAccessToken(); 
    const newStatus = currentStatus === "Connecte" ? "Non Connecte" : "Connecte";
    const response = await axios.patch(`${APPAREIL_API_URL}${appareilId}/`, { status: newStatus }, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};