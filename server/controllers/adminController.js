import Booking from "../models/Booking.js"
import { validateTransition } from "../utils/transitionValidator.js";
import { validateRole } from "../utils/roleGuard.js";
import { BOOKING_STATUS } from "../constants/bookingStatus.js";

export const deliverVehicle = async (req, res) => {
  const { bookingId } = req.params;
  const user = req.user;

  const booking = await Booking.findById(bookingId);

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  validateTransition(booking.status, BOOKING_STATUS.DELIVERED, booking.bookingType);
  validateRole(user.role, booking.status, BOOKING_STATUS.DELIVERED);

  booking.status = BOOKING_STATUS.DELIVERED;

  booking.lifecycleTimestamps.deliveredAt = new Date();

  booking.statusTimeline.push({
    status: BOOKING_STATUS.DELIVERED,
    updatedAt: new Date(),
    updatedBy: user.id,
    role: user.role,
  });

  await booking.save();

  res.json({ success: true, data: booking });
};