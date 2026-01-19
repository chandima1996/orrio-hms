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

export const createCheckoutSession = async (bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/bookings/create-checkout-session`, bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};

// Booking එකක් සාදන්න
export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/bookings`, bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

// 2. Dashboard එකට User ගේ Bookings ගන්න
export const fetchMyBookings = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/bookings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching my bookings:", error);
    throw error;
  }
};

// ... (Previous functions)

// Cancel Booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await axios.patch(`${API_URL}/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};

// Pay for Existing Booking
export const payForBooking = async (bookingId) => {
  try {
    const response = await axios.post(`${API_URL}/bookings/${bookingId}/pay`);
    return response.data;
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
};