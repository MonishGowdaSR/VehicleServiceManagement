import Booking from "../models/Booking.js"
import { validateTransition } from "../utils/transitionValidator.js";
import { validateRole } from "../utils/roleGuard.js";
import { BOOKING_STATUS } from "../constants/bookingStatus.js";

/* ================= START SERVICE ================= */
export const startService = async (req, res) => {
  const { bookingId } = req.params;
  const user = req.user;

  const booking = await Booking.findById(bookingId);

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  // ✅ Only assigned technician can start
  if (booking.technician?.toString() !== user.id) {
    return res.status(403).json({ message: "Not your booking" });
  }

  validateTransition(booking.status, BOOKING_STATUS.IN_PROGRESS, booking.bookingType);
  validateRole(user.role, booking.status, BOOKING_STATUS.IN_PROGRESS);

  booking.status = BOOKING_STATUS.IN_PROGRESS;

  booking.lifecycleTimestamps.inProgressAt = new Date();

  booking.statusTimeline.push({
    status: BOOKING_STATUS.IN_PROGRESS,
    updatedAt: new Date(),
    updatedBy: user.id,
    role: user.role,
  });

  await booking.save();

  res.json({ success: true, data: booking });
};

/* ================= COMPLETE SERVICE ================= */
export const completeService = async (req, res) => {
  const { bookingId } = req.params;
  const user = req.user;

  const booking = await Booking.findById(bookingId);

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (booking.technician?.toString() !== user.id) {
    return res.status(403).json({ message: "Not your booking" });
  }

  validateTransition(booking.status, BOOKING_STATUS.COMPLETED, booking.bookingType);
  validateRole(user.role, booking.status, BOOKING_STATUS.COMPLETED);

  booking.status = BOOKING_STATUS.COMPLETED;

  booking.lifecycleTimestamps.completedAt = new Date();

  booking.statusTimeline.push({
    status: BOOKING_STATUS.COMPLETED,
    updatedAt: new Date(),
    updatedBy: user.id,
    role: user.role,
  });

  // ✅ reduce load
  const technician = booking.technician;
  if (technician) {
    const Staff = (await import("../models/Staff.js")).default;
    await Staff.findByIdAndUpdate(technician, {
      $inc: { currentLoad: -1 },
    });
  }

  await booking.save();

  res.json({ success: true, data: booking });
};