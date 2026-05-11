import Vehicle from "../models/vehicleModel.js";
import {
  normalizeVehicleNumber,
  isValidIndianVehicleNumber
} from "../middleware/vehicleValidation.js";

/* ================= ADD VEHICLE ================= */
export const addVehicle =
  async (req, res) => {
    try {
      const userId =
        req.user.id;

      let {
        vehicleNumber,
        vehicleType,
        brand,
        model,
        fuelType
      } = req.body;

      if (
        !vehicleNumber ||
        !vehicleType
      ) {
        return res
          .status(400)
          .json({
            message:
              "Vehicle number and type required"
          });
      }

      /* Mandatory Uploads */
      if (
        !req.files
          ?.vehiclePhoto?.[0]
      ) {
        return res
          .status(400)
          .json({
            message:
              "Vehicle photo is required"
          });
      }

      if (
        !req.files
          ?.licenseDocument?.[0]
      ) {
        return res
          .status(400)
          .json({
            message:
              "Driving license is required"
          });
      }

      vehicleNumber =
        normalizeVehicleNumber(
          vehicleNumber
        );

      if (
        !isValidIndianVehicleNumber(
          vehicleNumber
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid vehicle number format"
          });
      }

      const vehiclePhoto =
        req.files
          .vehiclePhoto[0]
          .path ||
        req.files
          .vehiclePhoto[0]
          .filename;

      const licenseDocument =
        req.files
          .licenseDocument[0]
          .path ||
        req.files
          .licenseDocument[0]
          .filename;

      const vehicle =
        await Vehicle.create(
          {
            user: userId,
            vehicleNumber,
            vehicleType,
            brand:
              brand || "",
            model:
              model || "",
            fuelType:
              fuelType ||
              "PETROL",
            vehiclePhoto,
            licenseDocument
          }
        );

      res
        .status(201)
        .json({
          success: true,
          data: vehicle
        });
    } catch (error) {
      if (
        error.code ===
        11000
      ) {
        return res
          .status(400)
          .json({
            message:
              "Vehicle already exists"
          });
      }

      res
        .status(500)
        .json({
          message:
            error.message
        });
    }
  };

/* ================= GET VEHICLES ================= */
export const getVehicles =
  async (req, res) => {
    try {
      const vehicles =
        await Vehicle.find(
          {
            user:
              req.user.id,
            isDeleted:
              false
          }
        ).sort({
          createdAt:
            -1
        });

      res.json(
        vehicles
      );
    } catch (error) {
      res
        .status(500)
        .json({
          message:
            error.message
        });
    }
  };

/* ================= UPDATE VEHICLE ================= */
export const updateVehicle =
  async (req, res) => {
    try {
      const {
        id
      } = req.params;

      const vehicle =
        await Vehicle.findOne(
          {
            _id: id,
            user:
              req.user.id
          }
        );

      if (
        !vehicle
      ) {
        return res
          .status(404)
          .json({
            message:
              "Vehicle not found"
          });
      }

      let {
        vehicleNumber,
        vehicleType,
        brand,
        model,
        fuelType
      } = req.body;

      if (
        vehicleNumber
      ) {
        vehicleNumber =
          normalizeVehicleNumber(
            vehicleNumber
          );

        if (
          !isValidIndianVehicleNumber(
            vehicleNumber
          )
        ) {
          return res
            .status(400)
            .json({
              message:
                "Invalid vehicle number format"
            });
        }

        vehicle.vehicleNumber =
          vehicleNumber;
      }

      vehicle.vehicleType =
        vehicleType ||
        vehicle.vehicleType;

      vehicle.brand =
        brand ||
        vehicle.brand;

      vehicle.model =
        model ||
        vehicle.model;

      vehicle.fuelType =
        fuelType ||
        vehicle.fuelType;

      if (
        req.files
          ?.vehiclePhoto?.[0]
      ) {
        vehicle.vehiclePhoto =
          req.files
            .vehiclePhoto[0]
            .path;
      }

      if (
        req.files
          ?.licenseDocument?.[0]
      ) {
        vehicle.licenseDocument =
          req.files
            .licenseDocument[0]
            .path;
      }

      await vehicle.save();

      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      res
        .status(500)
        .json({
          message:
            error.message
        });
    }
  };

/* ================= DELETE ================= */
export const deleteVehicle =
  async (req, res) => {
    try {
      const vehicle =
        await Vehicle.findOneAndUpdate(
          {
            _id:
              req.params.id,
            user:
              req.user.id
          },
          {
            isDeleted:
              true
          },
          {
            new: true
          }
        );

      if (
        !vehicle
      ) {
        return res
          .status(404)
          .json({
            message:
              "Vehicle not found"
          });
      }

      res.json({
        success: true,
        message:
          "Vehicle deleted"
      });
    } catch (error) {
      res
        .status(500)
        .json({
          message:
            error.message
        });
    }
  };