import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yushinbox:golfstrimmar1966@cluster0.0pclh.mongodb.net"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
