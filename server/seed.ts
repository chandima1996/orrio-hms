import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "./src/models/hotel.model";
import Room from "./src/models/room.model";

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
    console.log("Connected to DB...");

   
    await Hotel.deleteMany();
    await Room.deleteMany();

    
    const luxuryRoom = await Room.create({
      title: "Ocean View Suite",
      price: 250,
      maxPeople: 2,
      desc: "A luxurious suite with panoramic ocean views and a private jacuzzi.",
      roomFacilities: ["King Bed", "Jacuzzi", "Ocean View", "Mini Bar", "AC", "WiFi"],
      imageUrls: ["https://images.unsplash.com/photo-1590490360182-c87295ecc059?q=80&w=2000"],
    });

    const deluxeRoom = await Room.create({
      title: "Deluxe Double Room",
      price: 150,
      maxPeople: 2,
      desc: "Spacious room with modern amenities and city views.",
      roomFacilities: ["Queen Bed", "City View", "TV", "AC", "WiFi"],
      imageUrls: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2000"],
    });

    const familyRoom = await Room.create({
      title: "Family Suite",
      price: 350,
      maxPeople: 4,
      desc: "Perfect for families, featuring two bedrooms and a living area.",
      roomFacilities: ["2 Double Beds", "Living Area", "Kitchenette", "AC", "WiFi"],
      imageUrls: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2000"],
    });

    // --- CREATE HOTELS & LINK ROOMS ---
    const hotels = [
      {
        name: "Cinnamon Grand Colombo",
        city: "Colombo",
        country: "Sri Lanka",
        address: "77 Galle Rd, Colombo 00300",
        phone: "+94 11 243 7437",
        email: "reservations@cinnamon.com",
        description: "Experience luxury in the heart of Colombo with world-class amenities and shopping nearby.",
        starRating: 5,
        facilities: ["Free WiFi", "Pool", "Spa", "Gym", "Bar"],
        imageUrls: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070"
        ],
        rooms: [deluxeRoom._id, luxuryRoom._id], // Linking Rooms
      },
      {
        name: "Araliya Green Hills",
        city: "Nuwara Eliya",
        country: "Sri Lanka",
        address: "No. 10, Glen Fall Road, Nuwara Eliya",
        phone: "+94 52 222 5000",
        email: "info@araliya.com",
        description: "A cozy retreat in the cool hills of Nuwara Eliya, perfect for a relaxing getaway.",
        starRating: 4,
        facilities: ["Heated Pool", "Bar", "Restaurant", "Parking"],
        imageUrls: [
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
        ],
        rooms: [deluxeRoom._id, familyRoom._id],
      },
    
    ];

    await Hotel.insertMany(hotels);
    console.log("Hotels & Rooms seeded successfully! 🌱");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();