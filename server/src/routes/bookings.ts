import express, { Request, Response } from "express";
import Stripe from "stripe";
import Room from "../models/room.model";
import Hotel from "../models/hotel.model";
import Booking from "../models/booking.model";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const getDatesInRange = (startDate: Date, endDate: Date) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const date = new Date(start.getTime());
  const dates = [];

  while (date <= end) {
    dates.push(new Date(date).getTime());
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

router.post("/create-checkout-session", async (req: Request, res: Response) => {
  const { roomId, hotelId, numberOfNights } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
         res.status(404).json({ message: "Room not found" });
         return;
    }

    const hotel = await Hotel.findById(hotelId);
    const hotelName = hotel ? hotel.name : "Hotel Stay";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${hotelName} - ${room.title}`,
              description: `Booking for ${numberOfNights} nights. Max guests: ${room.maxPeople}`,
              images: room.imageUrls && room.imageUrls.length > 0 ? [room.imageUrls[0]] : [],
            },
            unit_amount: room.price * 100, 
          },
          quantity: numberOfNights,
        },
        
        {
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Service Charge",
                },
                unit_amount: 5000, 
            },
            quantity: 1,
        }
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/booking-success`,
      cancel_url: `${process.env.CLIENT_URL}/hotel/${hotelId}`,
    });

    res.json({ id: session.id, url: session.url });

  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: "Payment session creation failed" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { 
        userId, 
        hotelId, 
        roomId, 
        checkIn, 
        checkOut, 
        guests, 
        totalAmount, 
        status = "pending" 
    } = req.body;

    
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room type not found" });

    
    const alldates = getDatesInRange(checkIn, checkOut);

    
    let assignedRoomNumber = null;

    
    if (room.roomNumbers && room.roomNumbers.length > 0) {
        for (const rn of room.roomNumbers) {
            
            const isFound = rn.unavailableDates.some((date: Date) => 
                alldates.includes(new Date(date).getTime())
            );

            
            if (!isFound) {
                assignedRoomNumber = rn.number;
                
               
                await Room.updateOne(
                    { "roomNumbers.number": rn.number },
                    {
                        $push: {
                            "roomNumbers.$.unavailableDates": alldates
                        }
                    }
                );
                break; 
            }
        }
    } else {
        
        console.warn("No room numbers defined for room type:", room.title);
    }

    
    if (!assignedRoomNumber && room.roomNumbers && room.roomNumbers.length > 0) {
        return res.status(400).json({ message: "Sorry, no rooms available for selected dates." });
    }

    
    const newBooking = new Booking({
      userId,
      hotelId,
      roomId,
      roomNumber: assignedRoomNumber, 
      checkIn,
      checkOut,
      guests,
      totalAmount,
      status,
    });

    await newBooking.save();
    res.status(201).json(newBooking);

  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ message: "Error creating booking" });
  }
});


router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate("hotelId", "name city imageUrls") 
      .populate("roomId", "title price imageUrls")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});


router.patch("/:id/cancel", async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Update Status
    booking.status = "cancelled";
    await booking.save();

    

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking" });
  }
});


router.post("/:id/pay", async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
        .populate("roomId")
        .populate("hotelId");

    if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
    }

    // @ts-ignore
    const roomTitle = booking.roomId ? booking.roomId.title : "Room";
    // @ts-ignore
    const hotelName = booking.hotelId ? booking.hotelId.name : "Hotel";
    // @ts-ignore
    const imageUrl = booking.roomId?.imageUrls?.[0] || "";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Payment for: ${hotelName} - ${roomTitle}`,
              images: imageUrl ? [imageUrl] : [],
            },
            unit_amount: Math.round(booking.totalAmount * 100), 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/booking-success`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/user`,
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Payment session failed" });
  }
});

export default router;