import Booking from "../models/bookingModel.js";
import Driver from "../models/driversModel.js";
import User from "../models/userModel.js";

// Create a new booking
export const createBooking = async (req, res) => {
  const { userId, driverId, pickupLocation, dropoffLocation, rideDate } = req.body;

  try {
    const user = await User.findById(userId);
    const driver = await Driver.findById(driverId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    const newBooking = new Booking({
      user: userId,
      driver: driverId,
      pickupLocation,
      dropoffLocation,
      rideDate,
    });

    await newBooking.save();

    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create booking", error });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "username email")  // Populate user details
      .populate("driver", "name vehicleNumber status");  // Populate driver details

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

// Get a single booking by ID
export const getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (req.role === "driver" && booking.driver.toString() !== req.driver._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this booking" });
    }
    res.status(200).json(booking);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    if (!['pending', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }  // Return the updated document
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking status updated", booking: updatedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update booking status", error });
  }
};
