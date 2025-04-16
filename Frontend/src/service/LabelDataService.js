import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const LABEL_DATA_API_URL = "http://127.0.0.1:8000/api/label/labels/";

// Helper function to get the token from local storage
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
};

// Fetch all labels with token
export const fetchLabels = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(LABEL_DATA_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching labels:", error);
    throw error;
  }
};

// Fetch labels with streaming support and token
export const fetchLabelsStream = async () => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(`${LABEL_DATA_API_URL}?stream=true`, {
      responseType: "stream", // Ensure the response is treated as a stream
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response; // Return the raw response for streaming
  } catch (error) {
    console.error("Error fetching labels with streaming:", error);
    throw error;
  }
};
// Fetch a single label by ID with token
export const fetchLabelById = async (labelId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.get(`${LABEL_DATA_API_URL}${labelId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching label:", error);
    throw error;
  }
};

// Add a new label with matricule and token
export const addLabel = async (matricule, labelData) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.post(
      `${LABEL_DATA_API_URL}${matricule}/`,
      labelData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the headers
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding label:", error);
    throw error;
  }
};

// Update an existing label with token
export const updateLabel = async (labelId, updatedLabel) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.put(
      `${LABEL_DATA_API_URL}data/${labelId}/`,
      updatedLabel,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the headers
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating label:", error);
    throw error;
  }
};

// Delete a label with token
export const deleteLabel = async (labelId) => {
  try {
    const token = getAccessToken(); // Retrieve the token
    await axios.delete(`${LABEL_DATA_API_URL}data/${labelId}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    console.log(`Deleted label with ID: ${labelId}`);
  } catch (error) {
    console.error("Error deleting label:", error);
    throw error;
  }
};

export const importPresence = async () => {
  try {
    const token = getAccessToken();
    if (!token) {
      console.error("Access token not found");
      return;
    }
    const response = await axios.get("http://127.0.0.1:8000/api/label/zk_auto_import/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error importing presence:", error);
  }
};

export const downloadHistory = async (formattedDate) => {
  try {
    const token = getAccessToken();
    const url = "http://localhost:8000/api/label/import_original/";

    // Send POST request with the formatted date (e.g., "01/04/2025")
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

    // Since the response is always multipart/mixed, extract the boundary
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      throw new Error("Unable to determine multipart boundary");
    }
    const boundary = boundaryMatch[1];

    // Convert the blob to text (async/await style)
    const text = await blob.text();
    // Split using the boundary and filter out empty segments (and the end boundary marker)
    const parts = text
      .split(`--${boundary}`)
      .filter((part) => part.trim() && !part.includes("--"));

    // Process each multipart part
    parts.forEach((part) => {
      // Split headers and content by the first occurrence of a double newline (\r\n\r\n)
      const splitIndex = part.indexOf("\r\n\r\n");
      if (splitIndex === -1) return; // Skip if no header/content separator found

      const rawHeaders = part.substring(0, splitIndex);
      const csvContent = part.substring(splitIndex + 4).trim();

      // Default filename: using dashes in place of slashes from formattedDate
      let filename = `history_${formattedDate.replace(/\//g, "-")}.csv`;

      // Check for a filename in the part headers
      const headerLines = rawHeaders.split("\r\n");
      headerLines.forEach((line) => {
        const filenameMatch = line.match(/filename="(.+?)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      });

      // Create a Blob for the CSV content and trigger a download
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
    console.error("Error downloading history:", error);
  }
};