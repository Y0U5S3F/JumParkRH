import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const EMPLOYEE_API_URL = "http://127.0.0.1:8000/api/employe/employes/";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

export const fetchEmployes = async () => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(EMPLOYEE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data.map((emp) => ({
      id: emp.matricule,
      ...emp,
      departement: emp.departement ? emp.departement.nom : "N/A",
      service: emp.service ? emp.service.nom : "N/A",
    }));
  } catch (error) {
    throw error;
  }
};

export const deleteEmployee = async (matricule) => {
  try {
    const token = getAccessToken(); 
    await axios.delete(`${EMPLOYEE_API_URL}${matricule}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
  } catch (error) {
    throw error;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.post(EMPLOYEE_API_URL, employeeData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateEmployee = async (matricule, updatedData) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.put(`${EMPLOYEE_API_URL}${matricule}/`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchMinimalEmployes = async () => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(`${EMPLOYEE_API_URL}minimal/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data.map((emp) => ({
      matricule: emp.matricule,
      nom: emp.nom,
      prenom: emp.prenom,
    }));
  } catch (error) {
    throw error;
  }
};

export const fetchEmployeeMinimalByMatricule = async (matricule) => {
  try {
    const token = getAccessToken(); 
    const response = await axios.get(`${EMPLOYEE_API_URL}minimal/${matricule}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data; 
  } catch (error) {
    return { nom: "N/A", prenom: "N/A" }; 
  }
};

export const fetchEmployesStream = async (onData) => {
  try {
    const token = getAccessToken(); 

    const response = await axios({
      method: "GET",
      url: `${EMPLOYEE_API_URL}?stream=true`,
      responseType: "stream", 
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    const reader = response.data.getReader();
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

export const DownloadPresence = async (reportYear,reportMonth) => {
  try {
    const token = getAccessToken(); 
    const url = "http://127.0.0.1:8000/api/label/monthly_report/"; 

    const response = await axios.post(
      url,
      { report_month: reportMonth, report_year: reportYear }, 
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        responseType: "blob", 
      }
    );

    const contentDisposition = response.headers["content-disposition"];
    let filename = `presence_${reportYear}_${reportMonth}.csv`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+?)"/);
      if (match) {
        filename = match[1];
      }
    }

    const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/csv" }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    setSnackbar({
      open: true,
      severity: "success",
      message: "Fichier téléchargé avec succès!",
    });
  } catch (error) {
    setSnackbar({
      open: true,
      severity: "error",
      message: "Erreur lors du téléchargement du fichier.",
    });
  }
};
