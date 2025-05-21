import axios from "axios";
import {  ACCESS_TOKEN } from "../constants";

const TYPE_CONGE_API_URL = "http://127.0.0.1:8000/api/typeconge/typeconge/";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

export const fetchTypeConges = async () => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(TYPE_CONGE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTypeCongeById = async (typeCongeId) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(`${TYPE_CONGE_API_URL}${typeCongeId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addTypeConge = async (typeCongeData) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.post(TYPE_CONGE_API_URL, typeCongeData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateTypeConge = async (typeCongeId, updatedTypeConge) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.put(
      `${TYPE_CONGE_API_URL}${typeCongeId}/`,
      updatedTypeConge,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTypeConge = async (typeCongeId) => {
  try {
    const token = getAccessToken();
    await axios.delete(`${TYPE_CONGE_API_URL}${typeCongeId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};