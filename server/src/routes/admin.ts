import express, { Request, Response } from "express";
import User from "../models/user.model";
import Hotel from "../models/hotel.model";
import Room from "../models/room.model";
import Booking from "../models/booking.model";

const router = express.Router();

router.get("/stats", async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHotels = await Hotel.countDocuments();
    const totalRooms = await Room.countDocuments();
    
    
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    const rooms = await Room.find().sort({ createdAt: -1 });
    
    
    const bookingsList = await Booking.find()
        .populate("hotelId", "name")
        .populate("roomId", "title")
        .sort({ createdAt: -1 });

    const pendingBookings = bookingsList.filter(b => b.status === "pending").length;
    const confirmedBookings = bookingsList.filter(b => b.status === "confirmed").length;
    const cancelledBookings = bookingsList.filter(b => b.status === "cancelled").length;

    res.json({
      totalUsers,
      totalHotels,
      totalRooms,
      bookings: {
        total: bookingsList.length,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings
      },
      bookingsList, 
      users,
      hotels, 
      rooms
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ message: "Error fetching admin stats" });
  }
});

export default router;