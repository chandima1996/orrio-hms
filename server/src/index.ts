import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

import hotelRoutes from './routes/hotels';
import bookingRoutes from './routes/bookings';
import userRoutes from './routes/users';
import adminRoutes from './routes/admin'; 
import roomRoutes from './routes/rooms'; 

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/rooms", roomRoutes); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});