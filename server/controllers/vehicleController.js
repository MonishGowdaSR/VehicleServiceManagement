import Vehicle from "../models/vehicleModel.js";
import {
  normalizeVehicleNumber,
  isValidIndianVehicleNumber,
} from "../middleware/vehicleValidation.js";

// ✅ ADD VEHICLE (clean + safe)
export const addVehicle = async (req, res) => {
  try {
    const userId = req.user.id;

    let { vehicleNumber, vehicleType } = req.body;

    // 🔹 Basic validation
    if (!vehicleNumber || !vehicleType) {
      return res.status(400).json({
        message: "Vehicle number and type are required",
      });
    }

    // 🔹 Normalize + validate
    vehicleNumber = normalizeVehicleNumber(vehicleNumber);

    if (!isValidIndianVehicleNumber(vehicleNumber)) {
      return res.status(400).json({
        message: "Invalid vehicle number format",
      });
    }

    const vehicle = await Vehicle.create({
      user: userId,
      vehicleNumber,
      vehicleType,
    });

    res.status(201).json(vehicle);

  } catch (error) {
    // 🔹 Duplicate vehicle protection
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Vehicle already exists",
      });
    }

    console.error("DB ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};



// ✅ GET USER VEHICLES
export const getVehicles = async (req, res) => {
  try {
    const userId = req.user.id;

    const vehicles = await Vehicle.find({
      user: userId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ UPDATE VEHICLE
export const updateVehicle = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    let { vehicleNumber, vehicleType, brand, model, fuelType } = req.body;

    const vehicle = await Vehicle.findOne({ _id: id, user: userId });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (vehicleNumber) {
      vehicleNumber = normalizeVehicleNumber(vehicleNumber);

      if (!isValidIndianVehicleNumber(vehicleNumber)) {
        return res.status(400).json({
          message: "Invalid vehicle number format",
        });
      }

      vehicle.vehicleNumber = vehicleNumber;
    }

    vehicle.vehicleType = vehicleType || vehicle.vehicleType;
    vehicle.brand = brand || vehicle.brand;
    vehicle.model = model || vehicle.model;
    vehicle.fuelType = fuelType || vehicle.fuelType;

    const updated = await vehicle.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ SOFT DELETE
export const deleteVehicle = async (req, res) => {
  try {
    const userId = req.user.id;

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { isDeleted: true },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Vehicle deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};