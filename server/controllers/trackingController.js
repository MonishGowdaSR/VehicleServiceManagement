import Booking from "../models/Booking.js";

// ✅ START TRACKING
export const startTracking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.serviceType !== "PICKUP") {
      return res.status(400).json({
        message: "Tracking only available for pickup bookings"
      });
    }

    booking.liveTracking = {
      isActive: true,
      agentId: userId,
      currentLocation: null
    };

    await booking.save();

    res.json({
      success: true,
      message: "Tracking started"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ UPDATE LOCATION
export const updateLocation = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { lat, lng } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.liveTracking.currentLocation = {
      lat,
      lng,
      updatedAt: new Date()
    };

    await booking.save();

    res.json({
      success: true,
      message: "Location updated"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ GET TRACKING LOCATION (FINAL FIXED)
export const getTrackingLocation = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (!booking.liveTracking || !booking.liveTracking.currentLocation) {
      return res.status(404).json({
        message: "Location not available"
      });
    }

    res.json({
      success: true,
      data: {
        currentLocation: booking.liveTracking.currentLocation,
        isActive: booking.liveTracking.isActive,
        agentId: booking.liveTracking.agentId
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ STOP TRACKING
export const stopTracking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.liveTracking.isActive = false;

    await booking.save();

    res.json({
      success: true,
      message: "Tracking stopped"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};