import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* ================= HELPERS ================= */
const generateOtp = () =>
  Math.floor(
    100000 +
      Math.random() * 900000
  ).toString();

const createToken = (
  id,
  role
) =>
  jwt.sign(
    { id, role },
    process.env.JWT_SECRET ||
      "secretkey",
    { expiresIn: "7d" }
  );

/* ================= SIGNUP SEND OTP ================= */
export const sendSignupOtp =
  async (req, res) => {
    try {
      const {
        name,
        phone,
        email,
        profilePhoto
      } = req.body;

      if (
        !name ||
        !phone ||
        !email
      ) {
        return res
          .status(400)
          .json({
            message:
              "All fields required"
          });
      }

      const existing =
        await User.findOne({
          $or: [
            { phone },
            { email }
          ]
        });

      if (existing) {
        return res
          .status(400)
          .json({
            message:
              "User already exists"
          });
      }

      const otp =
        generateOtp();

      const user =
        await User.create({
          name,
          phone,
          email,
          role: "USER",
          profilePhoto:
            profilePhoto ||
            undefined,
          isPhoneVerified: false,
          otp: {
            code: otp,
            expiresAt:
              new Date(
                Date.now() +
                  5 *
                    60 *
                    1000
              )
          }
        });

      console.log(
        "SIGNUP OTP:",
        otp
      );

      res.json({
        success: true,
        message:
          "OTP sent"
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message
      });
    }
  };

/* ================= SIGNUP VERIFY OTP ================= */
export const verifySignupOtp =
  async (req, res) => {
    try {
      const {
        phone,
        otp
      } = req.body;

      const user =
        await User.findOne({
          phone
        });

      if (
        !user ||
        !user.otp ||
        user.otp.code !==
          otp
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid OTP"
          });
      }

      user.isPhoneVerified = true;
      user.otp = undefined;

      await user.save();

      const token =
        createToken(
          user._id,
          user.role
        );

      res.json({
        success: true,
        token,
        user
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message
      });
    }
  };

/* ================= USER SEND OTP ================= */
export const sendLoginOtp =
  async (req, res) => {
    try {
      const { phone } =
        req.body;

      const user =
        await User.findOne({
          phone,
          role: "USER"
        });

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found. Please sign up."
          });
      }

      const otp =
        generateOtp();

      user.otp = {
        code: otp,
        expiresAt:
          new Date(
            Date.now() +
              5 *
                60 *
                1000
          )
      };

      await user.save();

      console.log(
        "USER OTP:",
        otp
      );

      res.json({
        success: true,
        message:
          "OTP sent"
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message
      });
    }
  };

/* ================= USER VERIFY OTP ================= */
export const verifyOtp =
  async (req, res) => {
    try {
      const {
        phone,
        otp
      } = req.body;

      const user =
        await User.findOne({
          phone,
          role: "USER"
        });

      if (
        !user ||
        !user.otp ||
        user.otp.code !==
          otp
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid OTP"
          });
      }

      const token =
        createToken(
          user._id,
          user.role
        );

      res.json({
        success: true,
        token,
        user
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message
      });
    }
  };

/* ================= ADMIN SEND OTP ================= */
export const sendAdminOtp =
  async (req, res) => {
    try {
      const {
        email,
        phone
      } = req.body;

      const admin =
        await User.findOne({
          email,
          phone,
          role: "ADMIN"
        });

      if (!admin) {
        return res
          .status(404)
          .json({
            message:
              "Admin not found"
          });
      }

      const otp =
        generateOtp();

      admin.otp = {
        code: otp,
        expiresAt:
          new Date(
            Date.now() +
              5 *
                60 *
                1000
          )
      };

      await admin.save();

      console.log(
        "ADMIN OTP:",
        otp
      );

      res.json({
        success: true,
        message:
          "Admin OTP sent"
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message
      });
    }
  };

/* ================= ADMIN VERIFY OTP ================= */
export const verifyAdminOtp =
  async (req, res) => {
    try {
      const {
        email,
        phone,
        otp
      } = req.body;

      const admin =
        await User.findOne({
          email,
          phone,
          role: "ADMIN"
        });

      if (
        !admin ||
        !admin.otp ||
        admin.otp.code !==
          otp
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid OTP"
          });
      }

      const token =
        createToken(
          admin._id,
          "ADMIN"
        );

      res.json({
        success: true,
        token,
        user: admin
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message
      });
    }
  };