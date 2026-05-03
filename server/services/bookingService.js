import Booking from "../models/Booking.js";
import Staff from "../models/Staff.js";
import { TIME_SLOTS } from "../constants/timeSlots.js";
import { BOOKING_STATUS } from "../constants/bookingStatus.js";
import { validateTransition } from "../utils/transitionValidator.js";
import { validateRole } from "../utils/roleGuard.js";
import { getLeastBusyStaff } from "./assignmentService.js";

/* ======================================================
   TRACKING SIMULATION MEMORY
====================================================== */
const activeTrips = {};

/* GARAGE LOCATION */
const GARAGE = {
  lat: 12.9352,
  lng: 77.6245
};

/* DEFAULT CUSTOMER */
const DEFAULT_CUSTOMER = {
  lat: 12.9716,
  lng: 77.5946
};

/* ======================================================
   HELPER
====================================================== */
const getSlotDetails = (slotKey) => {
  return TIME_SLOTS.find((s) => s.key === slotKey);
};

const moveStep = (start, end, step, total) => {
  return {
    lat: start.lat + ((end.lat - start.lat) * step) / total,
    lng: start.lng + ((end.lng - start.lng) * step) / total
  };
};

/* ======================================================
   LIVE MOVEMENT SIMULATOR
====================================================== */
const startTrip = async (
  bookingId,
  from,
  to
) => {
  if (activeTrips[bookingId]) {
    clearInterval(activeTrips[bookingId]);
  }

  let step = 0;
  const total = 20;

  activeTrips[bookingId] =
    setInterval(async () => {
      step++;

      const location =
        moveStep(
          from,
          to,
          step,
          total
        );

      await Booking.findByIdAndUpdate(
        bookingId,
        {
          "liveTracking.isActive":
            true,
          "liveTracking.currentLocation":
            {
              lat:
                location.lat,
              lng:
                location.lng,
              updatedAt:
                new Date()
            }
        }
      );

      if (step >= total) {
        clearInterval(
          activeTrips[
            bookingId
          ]
        );

        delete activeTrips[
          bookingId
        ];
      }
    }, 2000); // every 2 sec
};

/* ======================================================
   AVAILABLE SLOTS
====================================================== */
const getAvailableSlots =
  async (
    bookingDate
  ) => {
    const pickupAgents =
      await Staff.countDocuments(
        {
          role:
            "PICKUP_AGENT",
          isAvailable:
            true
        }
      );

    const technicians =
      await Staff.countDocuments(
        {
          role:
            "TECHNICIAN",
          isAvailable:
            true
        }
      );

    const capacity =
      Math.min(
        pickupAgents,
        technicians
      );

    const availableSlots =
      [];

    for (let slot of TIME_SLOTS) {
      const count =
        await Booking.countDocuments(
          {
            bookingDate,
            slotKey:
              slot.key,
            status: {
              $ne:
                BOOKING_STATUS.CANCELLED
            }
          }
        );

      if (
        count <
        capacity
      ) {
        availableSlots.push(
          slot.key
        );
      }
    }

    return availableSlots;
  };

/* ======================================================
   CREATE BOOKING
====================================================== */
export const createBookingService =
  async (
    data,
    userId
  ) => {
    let {
      vehicle,
      serviceType,
      bookingDate,
      slotKey,
      bookingType,
      pickupAddress,
      instructions,
      issueDescription,
      damageImage
    } = data;

    if (
      typeof pickupAddress ===
      "string"
    ) {
      try {
        pickupAddress =
          JSON.parse(
            pickupAddress
          );
      } catch {
        pickupAddress =
          {};
      }
    }

    const slot =
      getSlotDetails(
        slotKey
      );

    if (!slot)
      throw new Error(
        "Invalid time slot"
      );

    const availableSlots =
      await getAvailableSlots(
        bookingDate
      );

    if (
      !availableSlots.includes(
        slotKey
      )
    ) {
      return {
        message:
          "Slot full",
        availableSlots
      };
    }

    const booking =
      await Booking.create(
        {
          user: userId,
          vehicle,
          serviceType,
          bookingDate,
          slotKey,
          timeSlot: {
            start:
              slot.start,
            end:
              slot.end
          },
          bookingType,
          pickupAddress,
          instructions,
          issueDescription,
          damageImage,
          status:
            BOOKING_STATUS.BOOKED,
          statusTimeline:
            [
              {
                status:
                  BOOKING_STATUS.BOOKED,
                updatedAt:
                  new Date(),
                updatedBy:
                  userId,
                role:
                  "USER"
              }
            ]
        }
      );

    return booking;
  };

/* ======================================================
   UPDATE STATUS + TRACKING
====================================================== */
export const updateBookingStatusService =
  async (
    bookingId,
    nextStatus,
    user
  ) => {
    const booking =
      await Booking.findById(
        bookingId
      );

    if (!booking)
      throw new Error(
        "Booking not found"
      );

    const currentStatus =
      booking.status;

    const roleToUse =
      user?.role ||
      "SYSTEM";

    validateTransition(
      currentStatus,
      nextStatus,
      booking.bookingType
    );

    validateRole(
      roleToUse,
      currentStatus,
      nextStatus
    );

    /* ASSIGN STAFF */
    if (
      nextStatus ===
        BOOKING_STATUS.ASSIGNED &&
      booking.bookingType ===
        "PICKUP"
    ) {
      const pickupAgent =
        await getLeastBusyStaff(
          "PICKUP_AGENT",
          booking.bookingDate,
          booking.slotKey
        );

      if (
        pickupAgent
      ) {
        booking.pickupAgent =
          pickupAgent._id;
      }
    }

    if (
      nextStatus ===
      BOOKING_STATUS.ASSIGNED
    ) {
      const technician =
        await getLeastBusyStaff(
          "TECHNICIAN",
          booking.bookingDate,
          booking.slotKey
        );

      if (
        technician
      ) {
        booking.technician =
          technician._id;
      }
    }

    /* PICKUP STARTED */
    if (
      nextStatus ===
      BOOKING_STATUS.PICKUP_STARTED
    ) {
      const customer =
        booking.pickupAddress
          ?.lat &&
        booking.pickupAddress
          ?.lng
          ? {
              lat:
                booking
                  .pickupAddress
                  .lat,
              lng:
                booking
                  .pickupAddress
                  .lng
            }
          : DEFAULT_CUSTOMER;

      booking.liveTracking =
        {
          isActive: true,
          currentLocation:
            GARAGE
        };

      await startTrip(
        booking._id,
        GARAGE,
        customer
      );
    }

    /* VEHICLE REACHED GARAGE */
    if (
      nextStatus ===
      BOOKING_STATUS.IN_PROGRESS &&
      booking.bookingType ===
        "PICKUP"
    ) {
      const customer =
        booking.pickupAddress
          ?.lat &&
        booking.pickupAddress
          ?.lng
          ? {
              lat:
                booking
                  .pickupAddress
                  .lat,
              lng:
                booking
                  .pickupAddress
                  .lng
            }
          : DEFAULT_CUSTOMER;

      await startTrip(
        booking._id,
        customer,
        GARAGE
      );
    }

    /* SERVICE COMPLETED */
    if (
      nextStatus ===
      BOOKING_STATUS.COMPLETED
    ) {
      booking.liveTracking.isActive =
        false;
    }

    booking.status =
      nextStatus;

    booking.statusTimeline.push(
      {
        status:
          nextStatus,
        updatedAt:
          new Date(),
        updatedBy:
          user?.id ||
          null,
        role:
          roleToUse
      }
    );

    await booking.save();

    return booking;
  };