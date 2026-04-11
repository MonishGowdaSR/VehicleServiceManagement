import { BOOKING_STATUS } from "../constants/bookingStatus.js";

export const validateRole = (role, currentStatus, nextStatus) => {
  const rules = {
    /* ================= SYSTEM ================= */
    SYSTEM: [
      ["BOOKED", "ASSIGNED"]
    ],

    /* ================= USER ================= */
    USER: [
      ["BOOKED", "CANCELLED"]
    ],

    /* ================= PICKUP AGENT ================= */
    PICKUP_AGENT: [
      ["ASSIGNED", "PICKUP_STARTED"]
    ],

    /* ================= TECHNICIAN ================= */
    TECHNICIAN: [
      ["PICKUP_STARTED", "IN_PROGRESS"],
      ["ASSIGNED", "IN_PROGRESS"], // for SELF booking
      ["IN_PROGRESS", "COMPLETED"]
    ],

    /* ================= ADMIN ================= */
    ADMIN: [
      ["ANY", "ASSIGNED"],
      ["ANY", "RESCHEDULED"],
      ["ANY", "CANCELLED"],
      ["ANY", "DELIVERED"]
    ]
  };

  const allowed = rules[role];

  if (!allowed) throw new Error("Invalid role");

  const isValid = allowed.some(([from, to]) => {
    return (from === "ANY" || from === currentStatus) && to === nextStatus;
  });

  if (!isValid) {
    throw new Error(
      `Role ${role} not allowed for ${currentStatus} → ${nextStatus}`
    );
  }
};