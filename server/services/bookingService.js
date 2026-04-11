import Booking from "../models/Booking.js";
import Staff from "../models/Staff.js";
import { TIME_SLOTS } from "../constants/timeSlots.js";
import { BOOKING_STATUS } from "../constants/bookingStatus.js";
import { validateTransition } from "../utils/transitionValidator.js";
import { validateRole } from "../utils/roleGuard.js";
import { getLeastBusyStaff } from "./assignmentService.js";

/* ================= HELPER ================= */
const getSlotDetails = (slotKey) => {
  return TIME_SLOTS.find((s) => s.key === slotKey);
};

/* ================= AVAILABLE SLOTS ================= */
const getAvailableSlots = async (bookingDate, bookingType) => {
  const pickupAgents = await Staff.countDocuments({
    role: "PICKUP_AGENT",
    isAvailable: true,
  });

  const technicians = await Staff.countDocuments({
    role: "TECHNICIAN",
    isAvailable: true,
  });

  const capacity = Math.min(pickupAgents, technicians);

  const availableSlots = [];

  for (let slot of TIME_SLOTS) {
    const count = await Booking.countDocuments({
      bookingDate,
      slotKey: slot.key,
      status: { $ne: BOOKING_STATUS.CANCELLED },
    });

    if (count < capacity) {
      availableSlots.push(slot.key);
    }
  }

  return availableSlots;
};

/* ================= CREATE BOOKING ================= */
export const createBookingService = async (data, userId) => {
  const {
    vehicle,
    serviceType,
    bookingDate,
    slotKey,
    bookingType,
    pickupAddress,
    instructions,
  } = data;

  const slot = getSlotDetails(slotKey);
  if (!slot) throw new Error("Invalid time slot");

  /* 🚫 Past time check */
  const today = new Date().toISOString().split("T")[0];
  const selectedDate = new Date(bookingDate).toISOString().split("T")[0];

  if (selectedDate === today) {
    const currentHour = new Date().getHours();
    const slotStartHour = parseInt(slot.start.split(":")[0]);

    if (slotStartHour <= currentHour) {
      return {
        message: "Selected time passed",
        availableSlots: await getAvailableSlots(bookingDate, bookingType),
      };
    }
  }

  /* 🚫 Daily limit */
  const count = await Booking.countDocuments({
    user: userId,
    bookingDate,
    status: { $ne: BOOKING_STATUS.CANCELLED },
  });

  if (count >= 3 && serviceType !== "CAR_WASH") {
    throw new Error("Daily booking limit reached");
  }

  /* 🚫 Duplicate */
  const duplicate = await Booking.findOne({
    vehicle,
    bookingDate,
    slotKey,
    status: { $ne: BOOKING_STATUS.CANCELLED },
  });

  if (duplicate) throw new Error("Duplicate booking");

  /* 🚫 Pickup validation */
  if (bookingType === "PICKUP" && !pickupAddress?.address) {
    throw new Error("Pickup address required");
  }

  /* 🚫 Slot capacity */
  const availableSlots = await getAvailableSlots(
    bookingDate,
    bookingType
  );

  if (!availableSlots.includes(slotKey)) {
    return {
      message: "Slot full",
      availableSlots,
    };
  }

  /* ✅ Create booking (NO STAFF ASSIGNMENT HERE) */
  const booking = await Booking.create({
    user: userId,
    vehicle,
    serviceType,
    bookingDate,
    slotKey,
    timeSlot: { start: slot.start, end: slot.end },
    bookingType,
    pickupAddress,
    instructions,
    status: BOOKING_STATUS.BOOKED,
    statusTimeline: [
      {
        status: BOOKING_STATUS.BOOKED,
        updatedAt: new Date(),
        updatedBy: userId,
        role: "USER",
      },
    ],
  });

  return booking;
};

/* ================= UPDATE STATUS ================= */
export const updateBookingStatusService = async (
  bookingId,
  nextStatus,
  user
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  const currentStatus = booking.status;

  /* ================= DETERMINE ROLE ================= */
  let roleToUse = user?.role || "SYSTEM";

  // 🔥 SYSTEM ACTIONS (auto assignment)
  if (nextStatus === BOOKING_STATUS.ASSIGNED) {
    roleToUse = "SYSTEM";
  }

  /* ================= VALIDATIONS ================= */
  validateTransition(currentStatus, nextStatus, booking.bookingType);
  validateRole(roleToUse, currentStatus, nextStatus);

  /* ================= CANCEL RULE ================= */
  if (
    nextStatus === BOOKING_STATUS.CANCELLED &&
    currentStatus !== BOOKING_STATUS.BOOKED
  ) {
    throw new Error("Cancellation only allowed in BOOKED state");
  }

  /* ================= ASSIGN STAFF ================= */
  if (nextStatus === BOOKING_STATUS.ASSIGNED) {
    if (booking.bookingType === "PICKUP") {
      const pickupAgent = await getLeastBusyStaff(
        "PICKUP_AGENT",
        booking.bookingDate,
        booking.slotKey
      );

      if (!pickupAgent) throw new Error("No pickup agent available");

      booking.pickupAgent = pickupAgent._id;

      pickupAgent.currentLoad += 1;
      await pickupAgent.save();
    }

    const technician = await getLeastBusyStaff(
      "TECHNICIAN",
      booking.bookingDate,
      booking.slotKey
    );

    if (!technician) throw new Error("No technician available");

    booking.technician = technician._id;

    technician.currentLoad += 1;
    await technician.save();
  }

  /* ================= LIVE TRACKING ================= */
  if (nextStatus === BOOKING_STATUS.PICKUP_STARTED) {
    booking.liveTracking.isActive = true;
  }

  if (nextStatus === BOOKING_STATUS.IN_PROGRESS) {
    booking.liveTracking.isActive = false;
  }

  /* ================= LOAD REDUCE ================= */
  if (nextStatus === BOOKING_STATUS.COMPLETED) {
    if (booking.technician) {
      const tech = await Staff.findById(booking.technician);
      if (tech) {
        tech.currentLoad = Math.max(0, tech.currentLoad - 1);
        await tech.save();
      }
    }
  }

  /* ================= UPDATE STATUS ================= */
  booking.status = nextStatus;

  booking.statusTimeline.push({
    status: nextStatus,
    updatedAt: new Date(),
    updatedBy: user?.id || null,
    role: roleToUse,
  });

  const map = {
    ASSIGNED: "assignedAt",
    PICKUP_STARTED: "pickupStartedAt",
    IN_PROGRESS: "inProgressAt",
    COMPLETED: "completedAt",
    DELIVERED: "deliveredAt",
  };

  if (map[nextStatus]) {
    booking.lifecycleTimestamps[map[nextStatus]] = new Date();
  }

  await booking.save();

  return await Booking.findById(booking._id)
    .populate("technician")
    .populate("pickupAgent");
};