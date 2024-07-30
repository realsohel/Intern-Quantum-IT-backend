import mongoose from "mongoose";

const connectDB = async () => {
    
    try {
        mongoose.set('strictQuery',false)
        await mongoose.connect(process.env.MONGO_URL);
    
        console.log("MongoDB database connected");
    } catch (err) {
        console.log("MongoDB database connection failed",err);
    }
};

export default connectDB;