import mongoose from "mongoose";
import { BOOKING_STATUS } from "../constants/bookingStatus.js";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true
    },

    serviceType: {
      type: String,
      enum: ["GENERAL_SERVICE", "REPAIR", "CAR_WASH"],
      required: true
    },

    bookingDate: {
      type: Date,
      required: true,
      index: true
    },

    slotKey: {
      type: String,
      required: true,
      index: true
    },

    timeSlot: {
      start: String,
      end: String
    },

    bookingType: {
      type: String,
      enum: ["SELF", "PICKUP"],
      required: true
    },

    pickupAddress: {
      address: String,
      lat: Number,
      lng: Number
    },

    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.BOOKED,
      index: true
    },

    pickupAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null
    },

    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null
    },

    // ⚠️ Deprecated (remove later)
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    statusTimeline: [
      {
        status: {
          type: String,
          enum: Object.values(BOOKING_STATUS)
        },
        updatedAt: Date,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        role: {
          type: String,
          role: {
  type: String,
  enum: ["USER", "ADMIN", "TECHNICIAN", "PICKUP_AGENT", "SYSTEM"]
}
        }
      }
    ],

    lifecycleTimestamps: {
      assignedAt: Date,
      pickupStartedAt: Date,
      inProgressAt: Date,
      completedAt: Date,
      deliveredAt: Date
    },

    liveTracking: {
      currentLocation: {
        lat: Number,
        lng: Number
      },
      isActive: {
        type: Boolean,
        default: false
      }
    },

    liveStreamUrl: {
      type: String,
      default: null
    },

    instructions: {
      type: String,
      maxlength: 500
    },

    estimatedPrice: {
      type: Number,
      default: 0
    },

    finalPrice: {
      type: Number
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

bookingSchema.index({ bookingDate: 1, slotKey: 1 });
bookingSchema.index({ user: 1, bookingDate: 1 });

export default mongoose.model("Booking", bookingSchema);