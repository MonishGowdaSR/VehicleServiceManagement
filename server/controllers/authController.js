import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* ================= REGISTER USER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password } =
      req.body;

    const existingUser =
      await User.findOne({
        $or: [{ phone }, { email }]
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "User already exists"
      });
    }

    const user = await User.create({
      name,
      phone,
      email,
      password,
      role: "USER"
    });

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= USER SEND OTP ================= */
export const sendLoginOtp = async (
  req,
  res
) => {
  try {
    const { phone } = req.body;

    let user =
      await User.findOne({
        phone
      });

    if (!user) {
      user = await User.create({
        name: "New User",
        phone,
        email: `${phone}@demo.com`,
        password: "123456",
        role: "USER"
      });
    }

    const otp = Math.floor(
  100000 + Math.random() * 900000
).toString();

user.otp = {
  code: otp,
      expiresAt: new Date(
        Date.now() +
          5 * 60 * 1000
      )
    };
    console.log("USER OTP:", otp);

    await user.save();

    res.json({
      success: true,
      message: "OTP sent"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= USER VERIFY OTP ================= */
export const verifyOtp = async (
  req,
  res
) => {
  try {
    const { phone, otp } =
      req.body;

    const user =
      await User.findOne({
        phone
      });

    if (
      !user ||
      !user.otp ||
      user.otp.code !== otp
    ) {
      return res.status(400).json({
        message:
          "Invalid OTP"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET ||
        "secretkey",
      {
        expiresIn: "7d"
      }
    );

    res.json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
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
        return res.status(404).json({
          message:
            "Admin not found"
        });
      }

     const otp = Math.floor(
  100000 + Math.random() * 900000
).toString();

admin.otp = {
  code: otp,
        expiresAt: new Date(
          Date.now() +
            5 * 60 * 1000
        )
      };
      console.log("USER OTP:", otp);

      await admin.save();

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
        admin.otp.code !== otp
      ) {
        return res.status(400).json({
          message:
            "Invalid OTP"
        });
      }

      const token = jwt.sign(
        {
          id: admin._id,
          role: "ADMIN"
        },
        process.env.JWT_SECRET ||
          "secretkey",
        {
          expiresIn: "7d"
        }
      );

      res.json({
        success: true,
        token
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message
      });
    }
  };