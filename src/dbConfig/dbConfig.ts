import mongoose from "mongoose";

export async function connectDB() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    connection.on("error", (error) => {
      console.log("MongoDB connection error:", error.message);
      process.exit(); // Exit the process with failure
    });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
}
