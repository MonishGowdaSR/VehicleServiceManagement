import mongoose from "mongoose";
import { BOOKING_STATUS } from "../constants/bookingStatus.js";

const bookingSchema =
  new mongoose.Schema(
    {
      /* ================= USER ================= */
      user: {
        type: mongoose
          .Schema.Types
          .ObjectId,
        ref: "User",
        required: true,
        index: true
      },

      /* ================= VEHICLE ================= */
      vehicle: {
        type: mongoose
          .Schema.Types
          .ObjectId,
        ref: "Vehicle",
        required: true
      },

      /* ================= SERVICE ================= */
      serviceType: {
        type: String,
        enum: [
          "GENERAL_SERVICE",
          "REPAIR",
          "CAR_WASH",
          "BATTERY",
          "INSURANCE",
          "PUNCTURE"
        ],
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
        enum: [
          "SELF",
          "PICKUP"
        ],
        required: true
      },

      /* ================= STRUCTURED PICKUP ADDRESS ================= */
      pickupAddress: {
        houseNo: {
          type: String,
          default: ""
        },

        street: {
          type: String,
          default: ""
        },

        area: {
          type: String,
          default: ""
        },

        landmark: {
          type: String,
          default: ""
        },

        city: {
          type: String,
          default:
            "Bengaluru"
        },

        state: {
          type: String,
          default:
            "Karnataka"
        },

        pincode: {
          type: String,
          default: ""
        },

        lat: Number,
        lng: Number
      },

      /* ================= ISSUE DESCRIPTION ================= */
      issueDescription: {
        type: String,
        required: true,
        maxlength: 1000
      },

      /* ================= DAMAGE IMAGE ================= */
      damageImage: {
        type: String,
        default: null
      },

      /* ================= STATUS ================= */
      status: {
        type: String,
        enum: Object.values(
          BOOKING_STATUS
        ),
        default:
          BOOKING_STATUS.BOOKED,
        index: true
      },

      /* ================= STAFF ================= */
      pickupAgent: {
        type: mongoose
          .Schema.Types
          .ObjectId,
        ref: "Staff",
        default: null
      },

      technician: {
        type: mongoose
          .Schema.Types
          .ObjectId,
        ref: "Staff",
        default: null
      },

      staff: {
        type: mongoose
          .Schema.Types
          .ObjectId,
        ref: "Staff",
        default: null
      },

      assignedBy: {
        type: mongoose
          .Schema.Types
          .ObjectId,
        ref: "User",
        default: null
      },

      /* ================= TIMELINE ================= */
      statusTimeline: [
        {
          status: {
            type: String,
            enum: Object.values(
              BOOKING_STATUS
            )
          },

          updatedAt:
            Date,

          updatedBy: {
            type: mongoose
              .Schema.Types
              .ObjectId,
            ref: "User"
          },

          role: {
            type: String,
            enum: [
              "USER",
              "ADMIN",
              "TECHNICIAN",
              "PICKUP_AGENT",
              "SYSTEM"
            ]
          }
        }
      ],

      /* ================= LIFECYCLE ================= */
      lifecycleTimestamps:
        {
          assignedAt:
            Date,
          pickupStartedAt:
            Date,
          inProgressAt:
            Date,
          completedAt:
            Date,
          deliveredAt:
            Date,

          paymentPendingAt:
            Date,

          paidAt:
            Date,

          readyForDeliveryAt:
            Date,
        },

      /* ================= LIVE TRACKING ================= */
      liveTracking: {
        isActive: {
          type:
            Boolean,
          default:
            false
        },

        currentLocation:
          {
            lat:
              Number,
            lng:
              Number,
            updatedAt:
              Date
          },

        agentId: {
          type: mongoose
            .Schema.Types
            .ObjectId,
          ref: "Staff"
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

      /* ================= INVOICE ================= */
invoice: {
  baseAmount: {
    type: Number,
    default: 0
  },

  pickupCharge: {
    type: Number,
    default: 0
  },

  repairCharge: {
    type: Number,
    default: 0
  },

  discount: {
    type: Number,
    default: 0
  },

  totalAmount: {
    type: Number,
    default: 0
  },

  notes: {
    type: String,
    default: ""
  },

  generatedAt: Date
},

/* ================= PAYMENT ================= */
paymentStatus: {
  type: String,
  enum: [
    "NOT_REQUIRED",
    "PAYMENT_PENDING",
    "PAID",
    "FAILED"
  ],
  default:
    "NOT_REQUIRED"
},

paymentId: {
  type: String,
  default: ""
},

paidAt: Date,

      isDeleted: {
        type: Boolean,
        default: false
      }
    },
    {
      timestamps: true
    }
  );

/* ================= INDEXES ================= */
bookingSchema.index({
  bookingDate: 1,
  slotKey: 1
});

bookingSchema.index({
  user: 1,
  bookingDate: 1
});

export default mongoose.model(
  "Booking",
  bookingSchema
);