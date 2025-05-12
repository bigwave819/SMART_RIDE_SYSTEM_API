import express from "express";
import { 
    createBooking, 
    getAllBookings, 
    getSingleBooking, 
    updateBookingStatus 
} from "../controllers/bookingController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", requireAuth, createBooking);

router.get("/view", requireAuth, getAllBookings);
router.get("/view/:bookingId", requireAuth, getSingleBooking);
router.patch("/update/:bookingId/status", requireAuth, updateBookingStatus);

export default router;
