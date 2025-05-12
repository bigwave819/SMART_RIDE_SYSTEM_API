import  Driver from "../models/driversModel.js";
import bcrypt from "bcrypt";
import jwtToken from "../utils/jwtToken.js";

export const registerDriver = async (req, res) => {
  const { name, email, password, phoneNumber, vehicleNumber } = req.body;

  const existingDriver = await Driver.findOne({ email });
  if (existingDriver) {
    return res.status(400).json({ message: "Driver already exists" });
  }

  const hash = await bcrypt.hash(password, 10);
  const newDriver = await Driver.create({
    name, email, password: hash, phoneNumber, vehicleNumber
  });

  res.status(201).json({ message: "Driver registered successfully", driver: newDriver });
};

export const loginDriver = async (req, res) => {
  const { email, password } = req.body;

  const driver = await Driver.findOne({ email });
  if (!driver) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, driver.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwtToken({ id: driver._id, role: "driver" });

  res.status(200).json({ message: "Login successful", token });
};

export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select("-password"); // exclude password
    res.status(200).json(drivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
};

export const getSingleDriver = async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.findById(id).select("-password");

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch driver" });
  }
};


export const getUnavailableDrivers = async (req, res) => {
  try {
    const unavailableDrivers = await Driver.find({ status: 'unavailable' });
    
    if (unavailableDrivers.length === 0) {
      return res.status(404).json({ message: "No unavailable drivers found" });
    }

    res.status(200).json(unavailableDrivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch unavailable drivers", error });
  }
};

export const updateDriverStatus = async (req, res) => {
  const { driverId } = req.params; 
  const { status } = req.body; 

  try {
    if (!['available', 'unavailable'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. It must be 'available' or 'unavailable'" });
    }
    const updatedDriver = await Driver.findByIdAndUpdate(
      driverId, 
      { status }, 
      { new: true } 
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json(updatedDriver); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update driver status", error });
  }
};