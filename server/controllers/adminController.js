import Booking from "../models/Booking.js";
import { validateTransition } from "../utils/transitionValidator.js";
import { validateRole } from "../utils/roleGuard.js";
import { BOOKING_STATUS } from "../constants/bookingStatus.js";

/* ===============================
   GET ALL BOOKINGS
================================= */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("vehicle")
      .populate("pickupAgent")
      .populate("technician")
      .sort({ createdAt: -1 });

    res.json({
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

/* ===============================
   DELIVER VEHICLE
================================= */
export const deliverVehicle = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const user = req.user;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    validateTransition(
      booking.status,
      BOOKING_STATUS.DELIVERED,
      booking.bookingType
    );

    validateRole(
      user.role,
      booking.status,
      BOOKING_STATUS.DELIVERED
    );

    booking.status = BOOKING_STATUS.DELIVERED;

    booking.lifecycleTimestamps.deliveredAt =
      new Date();

    booking.statusTimeline.push({
      status: BOOKING_STATUS.DELIVERED,
      updatedAt: new Date(),
      updatedBy: user.id,
      role: user.role
    });

    await booking.save();

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};