import axios from 'axios';


const API_URL = 'http://localhost:8000/api';

export const fetchHotels = async () => {
  try {
    const response = await axios.get(`${API_URL}/hotels`);
    return response.data;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw error;
  }
};