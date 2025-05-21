import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const ABSENCE_API_URL = "http://127.0.0.1:8000/api/absence/absences/";


export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

export const fetchAbsences = async () => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(ABSENCE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAbsenceById = async (absenceId) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(`${ABSENCE_API_URL}${absenceId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const addAbsence = async (absenceData) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.post(ABSENCE_API_URL, absenceData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAbsence = async (absenceId, updatedAbsence) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.put(`${ABSENCE_API_URL}${absenceId}/`, updatedAbsence, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAbsence = async (absenceId) => {
  try {
    const token = getAccessToken(); 
    await axios.delete(`${ABSENCE_API_URL}${absenceId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
  } catch (error) {
    throw error;
  }
};