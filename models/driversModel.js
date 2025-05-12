import mongoose from "mongoose";

const driversSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,
        required: true,
        unique: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    status: { 
        type: String, 
        enum: ['available', 'unavailable'], 
        default: 'available' 
    }
}, { timestamps: true });


const Driver = mongoose.model("Driver", driversSchema);

export default Driver;
