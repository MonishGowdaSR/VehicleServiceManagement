import mongoose from "mongoose";

const vehicleSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose
          .Schema.Types
          .ObjectId,
        ref: "User",
        required: true,
        index: true
      },

      vehicleNumber: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
      },

      vehicleType: {
        type: String,
        enum: [
          "CAR",
          "BIKE",
          "E_CAR",
          "E_BIKE",
          "RICKSHAW",
          "E_RICKSHAW"
        ],
        required: true
      },

      brand: {
        type: String,
        trim: true,
        default: ""
      },

      model: {
        type: String,
        trim: true,
        default: ""
      },

      fuelType: {
        type: String,
        enum: [
          "PETROL",
          "DIESEL",
          "ELECTRIC",
          "CNG"
        ],
        default:
          "PETROL"
      },

      /* Vehicle Photo */
      vehiclePhoto: {
        type: String,
        default: null
      },

      /* DL / RC Proof */
      licenseDocument: {
        type: String,
        default: null
      },

      isDeleted: {
        type: Boolean,
        default: false,
        index: true
      }
    },
    {
      timestamps: true
    }
  );

/* Prevent duplicate vehicle per user */
vehicleSchema.index(
  {
    user: 1,
    vehicleNumber: 1
  },
  {
    unique: true
  }
);

/* Search index */
vehicleSchema.index({
  vehicleNumber: 1
});

/* Normalize number */
vehicleSchema.pre(
  "save",
  function () {
    if (
      this
        .vehicleNumber
    ) {
      this.vehicleNumber =
        this.vehicleNumber
          .replace(
            /[^A-Za-z0-9]/g,
            ""
          )
          .toUpperCase();
    }
  }
);

export default mongoose.model(
  "Vehicle",
  vehicleSchema
);