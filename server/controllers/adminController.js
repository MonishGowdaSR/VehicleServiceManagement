import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { validateTransition } from "../utils/transitionValidator.js";
import { validateRole } from "../utils/roleGuard.js";
import { BOOKING_STATUS } from "../constants/bookingStatus.js";



/* ==================================================
   DELIVERY SIMULATOR
================================================== */

const GARAGE = {
  lat: 12.9352,
  lng: 77.6245
};

const DEFAULT_CUSTOMER = {
  lat: 12.9716,
  lng: 77.5946
};

const activeTrips = {};

const moveStep = (
  start,
  end,
  step,
  total
) => {
  return {
    lat:
      start.lat +
      ((end.lat - start.lat) *
        step) /
        total,

    lng:
      start.lng +
      ((end.lng - start.lng) *
        step) /
        total
  };
};

const startDeliveryTrip =
  async (
    bookingId,
    from,
    to
  ) => {
    if (
      activeTrips[
        bookingId
      ]
    ) {
      clearInterval(
        activeTrips[
          bookingId
        ]
      );
    }

    let step = 0;
    const total = 20;

    activeTrips[
      bookingId
    ] = setInterval(
      async () => {
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

        if (
          step >=
          total
        ) {
          clearInterval(
            activeTrips[
              bookingId
            ]
          );

          delete activeTrips[
            bookingId
          ];

          await Booking.findByIdAndUpdate(
            bookingId,
            {
              "liveTracking.isActive":
                false
            }
          );
        }
      },
      2000
    );
  };

/* ===============================
   GET ALL BOOKINGS
================================= */
export const getAllBookings =
  async (req, res) => {
    try {
      const bookings =
        await Booking.find()
          .populate(
            "user",
            "name phone email profilePhoto"
          )
          .populate(
            "vehicle",
            "vehicleNumber vehicleType brand model image vehiclePhoto"
          )
          .populate(
            "pickupAgent",
            "name phone"
          )
          .populate(
            "technician",
            "name phone"
          )
          .sort({
            createdAt:
              -1
          });

      res.json({
        success: true,
        data: bookings
      });
    } catch (error) {
      res.status(500).json({
        success:
          false,
        message:
          error.message
      });
    }
  };

/* ===============================
   DELIVER VEHICLE
================================= */
export const deliverVehicle =
  async (req, res) => {
    try {
      const {
        bookingId
      } = req.params;

      const user =
        req.user;

      const booking =
        await Booking.findById(
          bookingId
        );

      if (
        !booking
      ) {
        return res
          .status(404)
          .json({
            success:
              false,
            message:
              "Booking not found"
          });
      }

      validateTransition(
        booking.status,
        BOOKING_STATUS.DELIVERED,
        booking.bookingType
      );

      validateRole(
        user.role,
        booking.status,
        BOOKING_STATUS.DELIVERED
      );

      const customer =
        booking
          .pickupAddress
          ?.lat &&
        booking
          .pickupAddress
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

      booking.status =
        BOOKING_STATUS.DELIVERED;

      booking.lifecycleTimestamps.deliveredAt =
        new Date();

      booking.statusTimeline.push(
        {
          status:
            BOOKING_STATUS.DELIVERED,
          updatedAt:
            new Date(),
          updatedBy:
            user.id,
          role:
            user.role
        }
      );

      booking.liveTracking =
        {
          isActive: true,
          currentLocation:
            GARAGE
        };

      await booking.save();

      await startDeliveryTrip(
        booking._id,
        GARAGE,
        customer
      );

      res.json({
        success: true,
        message:
          "Vehicle out for delivery",
        data: booking
      });
    } catch (error) {
      res.status(400)
        .json({
          success:
            false,
          message:
            error.message
        });
    }

  };
  /* ============================= */
/* GENERATE INVOICE */
/* ============================= */
export const generateInvoice =
  async (req, res) => {
    try {

      const { bookingId } =
        req.params;

      const {
        baseAmount,
        pickupCharge,
        repairCharge,
        discount,
        notes
      } = req.body;

      const booking =
        await Booking.findById(
          bookingId
        );

      if (!booking) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Booking not found"
          });
      }

      const totalAmount =
        Number(baseAmount || 0) +
        Number(pickupCharge || 0) +
        Number(repairCharge || 0) -
        Number(discount || 0);

      booking.invoice = {
        baseAmount,
        pickupCharge,
        repairCharge,
        discount,
        totalAmount,
        notes,
        generatedAt:
          new Date()
      };

      booking.paymentStatus =
        "PAYMENT_PENDING";

      booking.status =
        BOOKING_STATUS.PAYMENT_PENDING;

      booking.lifecycleTimestamps.paymentPendingAt =
        new Date();

      booking.statusTimeline.push(
        {
          status:
            BOOKING_STATUS.PAYMENT_PENDING,

          updatedAt:
            new Date(),

          updatedBy:
            req.user.id,

          role:
            req.user.role
        }
      );

      await booking.save();

      res.json({
        success: true,
        message:
          "Invoice generated successfully",
        data: booking
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

/* ===============================
   GET ALL USERS
================================= */
export const getAllUsers =
  async (req, res) => {
    try {
      const users =
        await User.find()
          .select("-password")
          .sort({
            createdAt: -1
          });

      res.json(users);
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  };