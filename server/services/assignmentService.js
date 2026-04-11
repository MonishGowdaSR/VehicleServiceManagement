import Booking from "../models/Booking.js";
import Staff from "../models/Staff.js";
import { BOOKING_STATUS } from "../constants/bookingStatus.js";

/* ================= GET LEAST BUSY STAFF (OPTIMIZED) ================= */
export const getLeastBusyStaff = async (role, bookingDate, slotKey) => {
  const staffs = await Staff.find({
    role,
    isAvailable: true,
  });

  if (!staffs.length) return null;

  // 🔥 Single aggregation instead of N queries
  const loads = await Booking.aggregate([
    {
      $match: {
        bookingDate,
        slotKey,
        status: { $ne: BOOKING_STATUS.CANCELLED },
      },
    },
    {
      $group: {
        _id: {
          $ifNull: ["$technician", "$pickupAgent"],
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const loadMap = {};
  loads.forEach((l) => {
    if (l._id) loadMap[l._id.toString()] = l.count;
  });

  let bestStaff = null;
  let minLoad = Infinity;

  for (let staff of staffs) {
    const load = loadMap[staff._id.toString()] || 0;

    if (load < minLoad) {
      minLoad = load;
      bestStaff = staff;
    }
  }

  return bestStaff;
};