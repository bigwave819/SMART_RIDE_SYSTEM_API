import express from "express";
import {
    registerDriver,
    loginDriver,
    getAllDrivers,
    getSingleDriver,
    getUnavailableDrivers,
    updateDriverStatus
} from "../controllers/driveController.js";

import {requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerDriver);
router.post("/login", loginDriver);

router.get("/view", requireAuth, requireAdmin, getAllDrivers);
router.get("/view/:id", requireAuth, getSingleDriver);
router.get("/unavailable", requireAuth ,getUnavailableDrivers);
router.patch("/:driverId/status", requireAuth ,updateDriverStatus);


export default router

