import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
    console.log(`MongoDB Connected: ${conn.connection.host} 🚀`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};