import dotenv from "dotenv";
dotenv.config({
  path: "./.env"
});


import express from "express";

import cors from "cors";
import http from "http";
import path from "path";
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
import paymentRoutes from "./routes/paymentRoutes.js";


connectDB();

const app = express();




/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin:
      "http://localhost:5173",

    credentials: true
  })
);
app.use(
  express.json({
    limit: "15mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "15mb"
  })
);

/* ================= STATIC FILES ================= */
/* REQUIRED FOR IMAGE VIEWING */
app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);

/* ================= ROUTES ================= */
app.use(
  "/api/payment",
  paymentRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/vehicles",
  vehicleRoutes
);

app.use(
  "/api/staff",
  staffRoutes
);

app.use(
  "/api/staff/auth",
  staffAuthRoutes
);

app.use(
  "/api/staff/actions",
  staffActionRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/tracking",
  trackingRoutes
);

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send(
    "API is running..."
  );
});

/* ================= SOCKET ================= */
const server =
  http.createServer(
    app
  );

const io =
  new Server(
    server,
    {
      cors: {
        origin: "*"
      }
    }
  );

app.set("io", io);

io.on(
  "connection",
  (socket) => {
    console.log(
      "User connected:",
      socket.id
    );

    socket.on(
      "joinBookingRoom",
      (
        bookingId
      ) => {
        socket.join(
          bookingId
        );
      }
    );

    socket.on(
      "disconnect",
      () => {
        console.log(
          "User disconnected"
        );
      }
    );
  }
);

/* ================= START ================= */
const PORT =
  process.env.PORT ||
  5000;

server.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);