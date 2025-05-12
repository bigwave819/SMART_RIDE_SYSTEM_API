import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js"
import connectDB from "./config/db.js";
import driversRoutes from "./routes/driverRoutes.js";

dotenv.config()


const { urlencoded } = bodyParser;
const app = express();
const PORT = process.env.PORT || 7000

app.use(cors());
app.use(express.json());
app.use(urlencoded({extended:true}));

connectDB();

//routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/drivers/", driversRoutes);


app.listen(PORT, () => {
    console.log(`THE server is running on the port ${PORT}`);    
})

