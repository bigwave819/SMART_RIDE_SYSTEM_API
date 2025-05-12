import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Driver from "../models/driversModel.js";

export const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);

    let user = await User.findById(decoded._id).select('_id role');
    if (user) {
      req.user = user;
      req.role = user.role;
      return next();
    }

    let driver = await Driver.findById(decoded._id).select('_id');
    if (driver) {
      req.driver = driver;
      req.role = "driver";
      return next();
    }

    return res.status(401).json({ message: "Unauthorized user or driver" });

  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 👇 Add these in the same file:

export const requireAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

