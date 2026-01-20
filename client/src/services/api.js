import axios from 'axios';

// Backend Base URL
// const API_URL = 'http://localhost:8000/api'; 
const API_URL = 'https://orrio-server.onrender.com/api'; 

// --- HOTELS ---
export const fetchHotels = async () => (await axios.get(`${API_URL}/hotels`)).data;
export const fetchHotelById = async (id) => (await axios.get(`${API_URL}/hotels/${id}`)).data;
export const searchHotelsAI = async (query) => (await axios.get(`${API_URL}/hotels/search?query=${query}`)).data;
export const createHotel = async (data) => (await axios.post(`${API_URL}/hotels`, data)).data;
export const updateHotel = async (id, data) => (await axios.put(`${API_URL}/hotels/${id}`, data)).data;
export const deleteHotel = async (id) => (await axios.delete(`${API_URL}/hotels/${id}`)).data;

// --- ROOMS ---

export const fetchRoomById = async (id) => (await axios.get(`${API_URL}/rooms/${id}`)).data; 
export const createRoom = async (hotelId, data) => (await axios.post(`${API_URL}/rooms/${hotelId}`, data)).data;
export const updateRoom = async (id, data) => (await axios.put(`${API_URL}/rooms/${id}`, data)).data;
export const deleteRoom = async (id) => (await axios.delete(`${API_URL}/rooms/${id}`)).data;

// --- BOOKINGS ---
export const createCheckoutSession = async (data) => (await axios.post(`${API_URL}/bookings/create-checkout-session`, data)).data;
export const createBooking = async (data) => (await axios.post(`${API_URL}/bookings`, data)).data;
export const fetchMyBookings = async (userId) => (await axios.get(`${API_URL}/bookings/user/${userId}`)).data;
export const cancelBooking = async (id) => (await axios.patch(`${API_URL}/bookings/${id}/cancel`)).data;
export const payForBooking = async (id) => (await axios.post(`${API_URL}/bookings/${id}/pay`)).data;

// --- USERS & ADMIN ---
export const syncUser = async (data) => (await axios.post(`${API_URL}/users/sync`, data)).data;
export const toggleFavorite = async (clerkId, hotelId) => (await axios.post(`${API_URL}/users/favorites`, { clerkId, hotelId })).data;
export const fetchFavorites = async (clerkId) => (await axios.get(`${API_URL}/users/${clerkId}/favorites`)).data;
export const fetchAdminStats = async () => (await axios.get(`${API_URL}/admin/stats`)).data;
export const createUser = async (data) => (await axios.post(`${API_URL}/users/create`, data)).data;
export const deleteUser = async (id) => (await axios.delete(`${API_URL}/users/${id}`)).data;
export const updateUser = async (id, data) => (await axios.put(`${API_URL}/users/${id}`, data)).data;