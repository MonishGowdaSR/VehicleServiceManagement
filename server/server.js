import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/auth.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import { seedStaff } from "./seeders/staffSeeder.js";
import bookingRoutes from "./routes/bookingRoutes.js";



dotenv.config();


const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/bookings", bookingRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

app.get("/", (req, res) => {
  res.send("Backend Running...");
});

const PORT = process.env.PORT || 5000;

// ✅ Single startup flow
const startServer = async () => {
  try {
    await connectDB();     // ensure DB connects first
    //await seedStaff();     // run ONCE

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server error:", error);
  }
};

startServer();