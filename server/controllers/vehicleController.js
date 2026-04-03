import Vehicle from "../models/Vehicle.js";

// ADD VEHICLE
export const addVehicle = async (req, res) => {
  try {
    const { ownerName, vehicleNumber, serviceType } = req.body;

    const vehicle = await Vehicle.create({
      ownerName,
      vehicleNumber,
      serviceType
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL VEHICLES
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE STATUS
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    vehicle.status = req.body.status || vehicle.status;

    const updatedVehicle = await vehicle.save();

    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  DELETE VEHICLE
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    await vehicle.deleteOne();

    res.json({ message: "Vehicle removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};