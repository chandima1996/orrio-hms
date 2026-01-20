import express, { Request, Response } from "express";
import Hotel from "../models/hotel.model";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


const cleanAIResponse = (text: string) => {
 
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

// 1. Get All Hotels
router.get("/", async (req: Request, res: Response) => {
  try {
    
    const hotels = await Hotel.find().populate("rooms");
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

// 2. AI Search Endpoint
router.get("/search", async (req: Request, res: Response) => {
  const { query } = req.query; 

  console.log("Received Search Query:", query); 

  if (!query) {
     res.status(400).json({ message: "Query is required" });
     return;
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
            You are a backend API assistant that converts natural language search queries into MongoDB find query objects (JSON).
            
            Database Schema:
            - name (String)
            - city (String)
            - country (String)
            - pricePerNight (Number)
            - starRating (Number)
            - facilities (Array of Strings)
            - description (String)

            Rules:
            1. Return ONLY the JSON object. 
            2. If user mentions a city, match "city" field using regex (case insensitive).
            3. If user mentions "cheap" or "budget", filter pricePerNight < 100.
            4. If user mentions "luxury", filter starRating >= 4.
            5. If user mentions facilities, use "$in" operator.

            Example Output format:
            { "city": { "$regex": "Galle", "$options": "i" } }
          `
        },
        {
          role: "user",
          content: query as string,
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
    });

    let aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
        throw new Error("No response from AI");
    }

    console.log("Raw AI Response:", aiResponse); 

    
    const cleanedResponse = cleanAIResponse(aiResponse);
    console.log("Cleaned JSON:", cleanedResponse); 
    const mongoQuery = JSON.parse(cleanedResponse);

    
    const hotels = await Hotel.find(mongoQuery);
    console.log(`Found ${hotels.length} hotels`); 

    res.json(hotels);

  } catch (error) {
    console.error("SERVER ERROR:", error); 
    res.status(500).json({ 
        message: "AI Search failed", 
        error: (error as Error).message 
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    
    const hotel = await Hotel.findById(id).populate("rooms");
    
    if (!hotel) {
        res.status(404).json({ message: "Hotel not found" });
        return; 
    }
    
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotel details" });
  }
});

// CREATE
router.post("/", async (req: Request, res: Response) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;