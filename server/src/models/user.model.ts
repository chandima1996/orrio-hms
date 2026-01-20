import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  savedHotels: mongoose.Types.ObjectId[]; 
  role: "user" | "admin";
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  savedHotels: [{ type: Schema.Types.ObjectId, ref: "Hotel" }],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;