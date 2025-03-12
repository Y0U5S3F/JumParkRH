import axios from "axios";

const SALAIRE_API_URL = "http://127.0.0.1:8000/api/salaire/salaires/";

// Fetch all salaires
export const fetchSalaires = async () => {
  try {
    const response = await axios.get(SALAIRE_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching salaires:", error);
    throw error;
  }
};

// Fetch a single salaire by ID
export const fetchSalaireById = async (salaireId) => {
  try {
    const response = await axios.get(`${SALAIRE_API_URL}${salaireId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching salaire:", error);
    throw error;
  }
};


// In SalaireService.js

export const downloadSalaire = async (salaireId) => {
  try {
    const url = `http://127.0.0.1:8000/api/salaire/generer/${salaireId}/`;
    const response = await axios.get(url, {
      responseType: "blob", // Get response as a Blob for binary data
    });
    
    // Extract filename from Content-Disposition header if available
    const contentDisposition = response.headers["content-disposition"];
    let filename = `salaire_${salaireId}.pdf`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+?)"/);
      if (match) {
        filename = match[1];
      }
    }
    
    // Create a URL for the Blob and simulate a download link click
    const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    // Clean up the DOM and revoke the object URL
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading salaire:", error);
  }
};

// Add a new salaire
export const addSalaire = async (salaireData) => {
  try {
    const response = await axios.post(SALAIRE_API_URL, salaireData);
    return response.data;
  } catch (error) {
    console.error("Error adding salaire:", error);
    throw error;
  }
};

// Update an existing salaire
export const updateSalaire = async (salaireId, updatedSalaire) => {
  try {
    const response = await axios.put(`${SALAIRE_API_URL}${salaireId}/`, updatedSalaire);
    return response.data;
  } catch (error) {
    console.error("Error updating salaire:", error);
    throw error;
  }
};

// Delete a salaire
export const deleteSalaire = async (salaireId) => {
  try {
    await axios.delete(`${SALAIRE_API_URL}${salaireId}/`);
  } catch (error) {
    console.error("Error deleting salaire:", error);
    throw error;
  }
};

export const fetchSalairesStream = async (onData) => {
  try {
    const response = await fetch(`${SALAIRE_API_URL}?stream=true`);

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
      buffer = lines.pop(); // Keep any incomplete JSON object for next iteration

      for (let line of lines) {
        if (line.trim()) {
          try {
            const parsedData = JSON.parse(line);
            onData(parsedData); // Pass each salary object to a callback
          } catch (err) {
            console.error("Error parsing streamed JSON:", err);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching streamed salaires:", error);
  }
};