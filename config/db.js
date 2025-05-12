import mongoose from "mongoose";


const connectDB = async (req, res) => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log("connected to the database");
    } catch (error) {
        res.status(500).json({
            message: "server error",
            error: error.message
        })
    }
}

export default connectDB;