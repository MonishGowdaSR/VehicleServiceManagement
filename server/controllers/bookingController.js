import Booking from "../models/Booking.js";
import {
  createBookingService,
  updateBookingStatusService,
} from "../services/bookingService.js";


/* ========================= */
/* CREATE BOOKING */
/* ========================= */

export const createBooking = async (req, res) => {
  try {
    const result = await createBookingService(
      req.body,
      req.user.id
    );

    // ⚠️ Handle slot suggestion cases
    if (result?.availableSlots) {
      return res.status(200).json({
        success: false,
        message: result.message,
        availableSlots: result.availableSlots,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id
    })
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ========================= */
/* UPDATE BOOKING STATUS */
/* ========================= */

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const updatedBooking = await updateBookingStatusService(
      id,
      status,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Booking status updated",
      data: updatedBooking,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};