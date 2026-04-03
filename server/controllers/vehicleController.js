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
    // 🔹 1. Extract query params
    const { keyword, status, page = 1, limit = 5 } = req.query;

    // 🔹 2. Build filter object
    let query = {};

    // Search by ownerName OR vehicleNumber
    if (keyword) {
      query.$or = [
        { ownerName: { $regex: keyword, $options: "i" } },
        { vehicleNumber: { $regex: keyword, $options: "i" } },
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // 🔹 3. Pagination calculations
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const skip = (pageNumber - 1) * pageSize;

    // 🔹 4. Fetch data
    const vehicles = await Vehicle.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    // 🔹 5. Total count
    const total = await Vehicle.countDocuments(query);

    // 🔹 6. Response
    res.json({
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      vehicles,
    });

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

export const getVehicleStats = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();

    const completed = await Vehicle.countDocuments({ status: "Completed" });
    const pending = await Vehicle.countDocuments({ status: "Pending" });

    res.json({
      totalVehicles,
      completed,
      pending,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};