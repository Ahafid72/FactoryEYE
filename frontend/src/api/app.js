// src/api/compressorApi.js
import axios from 'axios';
 
const API_URL = 'http://localhost:8080/api/compresseur'; // Adjust port if needed
 
export const uploadCompressorData = async (file) => {
  const formData = new FormData();
  formData.append('compressorFullData', file);
 
  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
 
export const getCompressorData = async () => {
  try {
    const response = await axios.get(`${API_URL}/data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching compressor data:', error);
    throw error;
  }
};
 