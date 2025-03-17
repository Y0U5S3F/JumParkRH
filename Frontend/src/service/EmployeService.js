import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const EMPLOYEE_API_URL = "http://127.0.0.1:8000/api/employe/employes/";

// Helper function to get the token from local storage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN);
};

// Fetch all employees with token
export const fetchEmployes = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(EMPLOYEE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data.map((emp) => ({
      id: emp.matricule,
      ...emp,
      departement: emp.departement ? emp.departement.nom : "N/A",
      service: emp.service ? emp.service.nom : "N/A",
    }));
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// Delete an employee by matricule with token
export const deleteEmployee = async (matricule) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    await axios.delete(`${EMPLOYEE_API_URL}${matricule}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    console.log("Deleted employee with matricule:", matricule);
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

// Add a new employee with token
export const addEmployee = async (employeeData) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.post(EMPLOYEE_API_URL, employeeData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

// Update an existing employee by matricule with token
export const updateEmployee = async (matricule, updatedData) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.put(`${EMPLOYEE_API_URL}${matricule}/`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

// Fetch minimal employee data with token
export const fetchMinimalEmployes = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(`${EMPLOYEE_API_URL}minimal/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data.map((emp) => ({
      matricule: emp.matricule,
      nom: emp.nom,
      prenom: emp.prenom,
    }));
  } catch (error) {
    console.error("Error fetching minimal employee data:", error);
    throw error;
  }
};

// Fetch employee minimal data by matricule with token
export const fetchEmployeeMinimalByMatricule = async (matricule) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(`${EMPLOYEE_API_URL}minimal/${matricule}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data; // Expected to return { nom: "John", prenom: "Doe" }
  } catch (error) {
    console.error(`Error fetching employee by matricule ${matricule}:`, error);
    return { nom: "N/A", prenom: "N/A" }; // Default values in case of error
  }
};

// Fetch employees as a stream with token
export const fetchEmployesStream = async (onData) => {
  try {
    const token = getAccessToken(); // Retrieve the token

    const response = await axios({
      method: "GET",
      url: `${EMPLOYEE_API_URL}?stream=true`,
      responseType: "stream", // Ensure the response is treated as a stream
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
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
      buffer = lines.pop(); // Keep any incomplete JSON object for next iteration

      for (let line of lines) {
        if (line.trim()) {
          try {
            const parsedData = JSON.parse(line);
            onData(parsedData); // Pass each employee object to a callback
          } catch (err) {
            console.error("Error parsing streamed JSON:", err);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching streamed employees:", error);
  }
};