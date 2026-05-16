import Booking from "../models/Booking.js";
import {
  createBookingService,
  updateBookingStatusService
} from "../services/bookingService.js";

/* ========================= */
/* CREATE BOOKING */
/* ========================= */
export const createBooking =
  async (req, res) => {
    try {
      const payload = {
        ...req.body
      };

      /* Damage Image Upload */
      if (
        req.file
      ) {
        payload.damageImage =
          req.file.path ||
          req.file.filename;
      }

      // CHECK EXISTING BOOKING
      const existingBooking =
        await Booking.findOne({
          vehicle: payload.vehicle,
          bookingDate: payload.bookingDate
        });

      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message:
            "This vehicle already has a booking on selected date"
        });
      }

      const result =
        await createBookingService(
          payload,
          req.user.id
        );

      /* Slot suggestion case */
      if (
        result
          ?.availableSlots
      ) {
        return res
          .status(200)
          .json({
            success:
              false,
            message:
              result.message,
            availableSlots:
              result.availableSlots
          });
      }

      return res
        .status(201)
        .json({
          success: true,
          message:
            "Booking created successfully",
          data: result
        });
    } catch (error) {
      return res
        .status(400)
        .json({
          success:
            false,
          message:
            error.message
        });
    }
  };

/* ========================= */
/* GET MY BOOKINGS */
/* ========================= */
export const getMyBookings =
  async (req, res) => {
    try {
      const bookings =
        await Booking.find(
          {
            user:
              req.user.id,
            isDeleted:
              false
          }
        )
          .populate(
            "vehicle"
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

      res
        .status(200)
        .json({
          success: true,
          data: bookings
        });
    } catch (error) {
      res
        .status(500)
        .json({
          success:
            false,
          message:
            error.message
        });
    }
  };

/* ========================= */
/* UPDATE BOOKING STATUS */
/* ========================= */
export const updateBookingStatus =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        status
      } = req.body;

      if (
        !status
      ) {
        return res
          .status(400)
          .json({
            success:
              false,
            message:
              "Status is required"
          });
      }

      const updatedBooking =
        await updateBookingStatusService(
          id,
          status,
          req.user
        );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Booking status updated",
          data: updatedBooking
        });
    } catch (error) {
      return res
        .status(400)
        .json({
          success:
            false,
          message:
            error.message
        });
    }
  };
  export const getAllBookings =
  async (req, res) => {

    try {

      const bookings =
        await Booking.find()
          .populate(
            "user",
            "name phone profilePhoto"
          )
          .populate(
            "vehicle"
          )
          .populate(
            "pickupAgent",
            "name"
          )
          .populate(
            "technician",
            "name"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        bookings,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch bookings",
      });
    }
  };