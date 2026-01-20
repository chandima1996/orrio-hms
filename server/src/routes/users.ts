import express, { Request, Response } from "express";
import User from "../models/user.model";
import Hotel from "../models/hotel.model";

const router = express.Router();


router.post("/sync", async (req: Request, res: Response) => {
  const { clerkId, email, firstName, lastName } = req.body;
  try {
    let user = await User.findOne({ clerkId });
    if (!user) {
      user = new User({ clerkId, email, firstName, lastName });
     
      if (email === "admin@orrio.com") user.role = "admin";
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error syncing user" });
  }
});

// 2. Toggle Favorite
router.post("/favorites", async (req: Request, res: Response) => {
  const { clerkId, hotelId } = req.body;
  try {
    const user = await User.findOne({ clerkId });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    const hotelIndex = user.savedHotels.indexOf(hotelId);
    if (hotelIndex === -1) {
      user.savedHotels.push(hotelId); 
    } else {
      user.savedHotels.splice(hotelIndex, 1); 
    }
    await user.save();
    
    // Return updated favorites list
    const populatedUser = await User.findById(user._id).populate("savedHotels");
    res.json(populatedUser?.savedHotels);
  } catch (error) {
    res.status(500).json({ message: "Error toggling favorite" });
  }
});

// 3. Get User Favorites
router.get("/:clerkId/favorites", async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId }).populate("savedHotels");
    res.json(user ? user.savedHotels : []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE USER
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;