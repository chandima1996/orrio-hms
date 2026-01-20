import mongoose, { Document } from "mongoose";

export interface IRoom extends Document {
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
  roomFacilities: string[];
  imageUrls: string[];
  
  roomNumbers: {
    number: number;
    unavailableDates: Date[]; 
  }[];
}

const roomSchema = new mongoose.Schema<IRoom>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  maxPeople: { type: Number, required: true },
  desc: { type: String, required: true },
  roomFacilities: [{ type: String }],
  imageUrls: [{ type: String }],
  roomNumbers: [{
    number: Number,
    unavailableDates: [{ type: Date }]
  }],
}, { timestamps: true });

const Room = mongoose.model<IRoom>("Room", roomSchema);
export default Room;