import { BOOKING_STATUS } from "../constants/bookingStatus.js";

export const validateRole = (
  role,
  currentStatus,
  nextStatus
) => {
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
      ["ASSIGNED", "IN_PROGRESS"], // SELF booking
      ["IN_PROGRESS", "COMPLETED"]
    ],

    /* ================= ADMIN ================= */
    ADMIN: [

  ["BOOKED", "ASSIGNED"],

  ["ASSIGNED", "PICKUP_STARTED"],

  ["PICKUP_STARTED", "IN_PROGRESS"],

  ["ASSIGNED", "IN_PROGRESS"],

  ["IN_PROGRESS", "COMPLETED"],

  ["COMPLETED", "PAYMENT_PENDING"],

  ["PAYMENT_PENDING", "PAID"],

  ["PAID", "READY_FOR_DELIVERY"],

  ["READY_FOR_DELIVERY", "DELIVERED"],

  ["ANY", "CANCELLED"],

  ["ANY", "RESCHEDULED"]

]
  };

  const allowed = rules[role];

  if (!allowed) {
    throw new Error("Invalid role");
  }

  const isValid = allowed.some(
    ([from, to]) =>
      (from === "ANY" ||
        from === currentStatus) &&
      to === nextStatus
  );

  if (!isValid) {
    throw new Error(
      `Role ${role} not allowed for ${currentStatus} → ${nextStatus}`
    );
  }
};