import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const SALAIRE_API_URL = "http://127.0.0.1:8000/api/salaire/salaires/";

// Helper function to get the token from local storage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

// Fetch all salaires
export const fetchSalaires = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(SALAIRE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a single salaire by ID
export const fetchSalaireById = async (salaireId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(`${SALAIRE_API_URL}${salaireId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadSalaire = async (salaireId) => {
  try {
    const token = getAccessToken();
    const url = `http://127.0.0.1:8000/api/salaire/generer/${salaireId}/`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
    
    const contentDisposition = response.headers["content-disposition"];
    let filename = `salaire_${salaireId}.pdf`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+?)"/);
      if (match) {
        filename = match[1];
      }
    }
    
    const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
  }
};

export const addSalaire = async (salaireData) => {
  try {
    const token = getAccessToken();
    const response = await axios.post(SALAIRE_API_URL, salaireData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSalaire = async (salaireId, updatedSalaire) => {
  try {
    const token = getAccessToken();
    const response = await axios.put(`${SALAIRE_API_URL}${salaireId}/`, updatedSalaire, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSalaire = async (salaireId) => {
  try {
    const token = getAccessToken();
    await axios.delete(`${SALAIRE_API_URL}${salaireId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const fetchSalairesStream = async (onData) => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${SALAIRE_API_URL}?stream=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.body) {
      throw new Error("ReadableStream not supported in this environment");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let lines = buffer.split("\n");
      buffer = lines.pop();

      for (let line of lines) {
        if (line.trim()) {
          try {
            const parsedData = JSON.parse(line);
            onData(parsedData);
          } catch (err) {
          }
        }
      }
    }
  } catch (error) {
  }
};