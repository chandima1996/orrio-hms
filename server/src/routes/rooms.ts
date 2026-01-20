import express, { Request, Response } from "express";
import Room from "../models/room.model";
import Hotel from "../models/hotel.model";

const router = express.Router();


router.post("/:hotelid", async (req: Request, res: Response) => {
  const hotelId = req.params.hotelid;
  const { title, price, maxPeople, desc, roomFacilities, imageUrls, startNumber, count } = req.body;

  
  const roomNumbers = [];
  const start = parseInt(startNumber) || 101;
  const amount = parseInt(count) || 1;

  for (let i = 0; i < amount; i++) {
      roomNumbers.push({ number: start + i, unavailableDates: [] });
  }

  const newRoom = new Room({
      title, price, maxPeople, desc, roomFacilities, imageUrls, roomNumbers
  });

  try {
    const savedRoom = await newRoom.save();
    try {
      
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE ROOM
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE ROOM
router.delete("/:id/:hotelid", async (req: Request, res: Response) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      console.log(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL ROOMS (Optional)
router.get("/", async (req: Request, res: Response) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET Single Room by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
        return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;

