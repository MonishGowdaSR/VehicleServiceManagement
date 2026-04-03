import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: true
    },
    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true
    },
    serviceType: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;