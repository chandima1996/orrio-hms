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


export const searchHotelsAI = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/hotels/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching hotels:", error);
    throw error;
  }
};

export const fetchHotelById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/hotels/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    throw error;
  }
};