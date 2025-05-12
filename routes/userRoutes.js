import express from "express";
import {
    loginUser,
    createUser,
    getUsers,
    getSingleUser
} from "../controllers/userController.js";

import {requireAuth} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", createUser)
router.get("/view", requireAuth, getUsers);
router.get("/view/:id", requireAuth, getSingleUser);

export default router;