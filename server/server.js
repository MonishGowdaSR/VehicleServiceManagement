import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import staffAuthRoutes from "./routes/staffAuthRoutes.js";
import staffActionRoutes from "./routes/staffActionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/staff", staffRoutes);

// 🔥 Create server
const server = http.createServer(app);

// 🔥 Socket setup
const io = new Server(server, {
  cors: { origin: "*" }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinBookingRoom", (bookingId) => {
    socket.join(bookingId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/staff/auth", staffAuthRoutes);
app.use("/api/staff/actions", staffActionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tracking", trackingRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});