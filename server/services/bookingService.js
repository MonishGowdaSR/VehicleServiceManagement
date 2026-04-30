import Booking from "../models/Booking.js";
import Staff from "../models/Staff.js";
import { TIME_SLOTS } from "../constants/timeSlots.js";
import { BOOKING_STATUS } from "../constants/bookingStatus.js";
import { validateTransition } from "../utils/transitionValidator.js";
import { validateRole } from "../utils/roleGuard.js";
import { getLeastBusyStaff } from "./assignmentService.js";

/* ================= HELPER ================= */
const getSlotDetails = (
  slotKey
) => {
  return TIME_SLOTS.find(
    (s) => s.key === slotKey
  );
};

/* ================= AVAILABLE SLOTS ================= */
const getAvailableSlots =
  async (
    bookingDate
  ) => {
    const pickupAgents =
      await Staff.countDocuments(
        {
          role: "PICKUP_AGENT",
          isAvailable:
            true
        }
      );

    const technicians =
      await Staff.countDocuments(
        {
          role: "TECHNICIAN",
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

/* ================= CREATE BOOKING ================= */
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

    /* ================= FIX JSON STRING ================= */
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

    if (!slot) {
      throw new Error(
        "Invalid time slot"
      );
    }

    /* ================= PAST DATE ================= */
    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    const selectedDate =
      new Date(
        bookingDate
      )
        .toISOString()
        .split("T")[0];

    if (
      selectedDate ===
      today
    ) {
      const currentHour =
        new Date().getHours();

      const slotHour =
        parseInt(
          slot.start.split(
            ":"
          )[0]
        );

      if (
        slotHour <=
        currentHour
      ) {
        return {
          message:
            "Selected time passed",
          availableSlots:
            await getAvailableSlots(
              bookingDate
            )
        };
      }
    }

    /* ================= PICKUP VALIDATION ================= */
    if (
      bookingType ===
      "PICKUP"
    ) {
      if (
        !pickupAddress
          ?.houseNo ||
        !pickupAddress
          ?.street ||
        !pickupAddress
          ?.area ||
        !pickupAddress
          ?.city ||
        !pickupAddress
          ?.state ||
        !pickupAddress
          ?.pincode
      ) {
        throw new Error(
          "Pickup address required"
        );
      }
    }

    /* ================= ISSUE DESCRIPTION ================= */
    if (
      !issueDescription
    ) {
      throw new Error(
        "Issue description required"
      );
    }

    /* ================= DUPLICATE ================= */
    const duplicate =
      await Booking.findOne(
        {
          vehicle,
          bookingDate,
          slotKey,
          status: {
            $ne:
              BOOKING_STATUS.CANCELLED
          }
        }
      );

    if (
      duplicate
    ) {
      throw new Error(
        "Duplicate booking"
      );
    }

    /* ================= SLOT CHECK ================= */
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

    /* ================= CREATE ================= */
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

/* ================= UPDATE STATUS ================= */
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

    let roleToUse =
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