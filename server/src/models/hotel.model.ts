import mongoose, { Document, Schema } from "mongoose";

export interface IHotel extends Document {
  name: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  starRating: number;
  facilities: string[];
  imageUrls: string[];
  rooms: string[];
  lat: number; 
  lng: number; 
  featured: boolean;
  lastUpdated: Date;
}

const hotelSchema = new mongoose.Schema<IHotel>({
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  starRating: { type: Number, min: 1, max: 5 },
  facilities: [{ type: String }],
  imageUrls: [{ type: String }],
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  lat: { type: Number, default: 6.9271 }, 
  lng: { type: Number, default: 79.8612 },
  featured: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
});

const Hotel = mongoose.model<IHotel>("Hotel", hotelSchema);
export default Hotel;