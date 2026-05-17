import { BOOKING_STATUS } from "../constants/bookingStatus.js";

const transitions = {

  BOOKED: [
    "ASSIGNED",
    "CANCELLED",
    "RESCHEDULED"
  ],

  ASSIGNED: [
    "PICKUP_STARTED",
    "IN_PROGRESS",
    "RESCHEDULED"
  ],

  PICKUP_STARTED: [
    "IN_PROGRESS",
    "RESCHEDULED"
  ],

  IN_PROGRESS: [
    "COMPLETED"
  ],

  COMPLETED: [
    "PAYMENT_PENDING"
  ],

  PAYMENT_PENDING: [
    "PAID"
  ],

  PAID: [
    "READY_FOR_DELIVERY"
  ],

  READY_FOR_DELIVERY: [
    "DELIVERED"
  ],

  DELIVERED: [],

  CANCELLED: [],

  RESCHEDULED: [
    "ASSIGNED"
  ]

};
export const validateTransition = (currentStatus, nextStatus, mode) => {
  if (!transitions[currentStatus]?.includes(nextStatus)) {
    throw new Error(`Invalid transition: ${currentStatus} → ${nextStatus}`);
  }

  // mode rules
  if (mode === "SELF" && nextStatus === BOOKING_STATUS.PICKUP_STARTED) {
    throw new Error("Pickup not allowed for SELF mode");
  }

  if (
    mode === "PICKUP" &&
    currentStatus === BOOKING_STATUS.ASSIGNED &&
    nextStatus === BOOKING_STATUS.IN_PROGRESS
  ) {
    throw new Error("Must go through PICKUP_STARTED first");
  }
};