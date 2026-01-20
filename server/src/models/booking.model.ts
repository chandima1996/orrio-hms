import mongoose, { Document, Schema } from "mongoose"; // Schema import කරන්න

export interface IBooking extends Document {
  userId: string;
  
  hotelId: mongoose.Types.ObjectId; 
  roomId: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: { adults: number; children: number };
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  paymentIntentId?: string;
  createdAt: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>({
  userId: { type: String, required: true },
  
  hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
  roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: {
    adults: { type: Number, required: true },
    children: { type: Number, required: true },
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  paymentIntentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;