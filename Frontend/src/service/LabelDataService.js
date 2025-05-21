import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const LABEL_DATA_API_URL = "http://127.0.0.1:8000/api/label/labels/";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

export const fetchLabels = async () => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(LABEL_DATA_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchLabelsStream = async () => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(`${LABEL_DATA_API_URL}?stream=true`, {
      responseType: "stream", 
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response; 
  } catch (error) {
    throw error;
  }
};
export const fetchLabelById = async (labelId) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(`${LABEL_DATA_API_URL}${labelId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addLabel = async (matricule, labelData) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.post(
      `${LABEL_DATA_API_URL}${matricule}/`,
      labelData,
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

export const updateLabel = async (labelId, updatedLabel) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.put(
      `${LABEL_DATA_API_URL}data/${labelId}/`,
      updatedLabel,
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

export const deleteLabel = async (labelId) => {
  try {
    const token = getAccessToken(); 
    await axios.delete(`${LABEL_DATA_API_URL}data/${labelId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
  } catch (error) {
    throw error;
  }
};

export const importPresence = async () => {
  try {
    const token = getAccessToken();
    if (!token) {
      return;
    }
    const response = await axios.get("http://127.0.0.1:8000/api/label/zk_auto_import/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
  }
};

export const downloadHistory = async (formattedDate) => {
  try {
    const token = getAccessToken();
    const url = "http://localhost:8000/api/label/import_original/";

    const response = await axios.post(
      url,
      { start_date: formattedDate },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
      }
    );

    const contentType =
      response.headers["content-type"] || "application/octet-stream";
    const blob = new Blob([response.data], { type: contentType });

    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      throw new Error("Unable to determine multipart boundary");
    }
    const boundary = boundaryMatch[1];

    const text = await blob.text();
    const parts = text
      .split(`--${boundary}`)
      .filter((part) => part.trim() && !part.includes("--"));

    parts.forEach((part) => {
      const splitIndex = part.indexOf("\r\n\r\n");
      if (splitIndex === -1) return; 

      const rawHeaders = part.substring(0, splitIndex);
      const csvContent = part.substring(splitIndex + 4).trim();

      let filename = `history_${formattedDate.replace(/\//g, "-")}.csv`;

      const headerLines = rawHeaders.split("\r\n");
      headerLines.forEach((line) => {
        const filenameMatch = line.match(/filename="(.+?)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      });

      const csvBlob = new Blob([csvContent], { type: "text/csv" });
      const blobUrl = window.URL.createObjectURL(csvBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    });
  } catch (error) {
  }
};