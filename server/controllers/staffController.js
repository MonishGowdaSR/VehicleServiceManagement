import Booking from "../models/Booking.js";

export const getMyBookings = async (req, res) => {
  const staffId = req.user.id;
  const role = req.user.role;

  let query = {};

  if (role === "TECHNICIAN") {
    query.technician = staffId;
  }

  if (role === "PICKUP_AGENT") {
    query.pickupAgent = staffId;
  }

  const bookings = await Booking.find(query)
    .populate("vehicle")
    .populate("user");

  res.json({
    success: true,
    data: bookings,
  });
};