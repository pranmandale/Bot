import mongoose from "mongoose";

const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

export default connectDB;
