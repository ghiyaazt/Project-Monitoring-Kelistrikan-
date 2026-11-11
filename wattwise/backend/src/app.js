const express = require("express");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const kosRoutes = require("./routes/kosRoutes");
const roomRoutes = require("./routes/roomRoutes");
const penghuniRoutes = require("./routes/penghuniRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const financeRoutes = require("./routes/financeRoutes");
const web2Routes = require("./routes/web2Routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "WattWise Backend is running!",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            otp: "/api/otp",
            sensor: "/api/sensor",
            kos: "/api/kos",
            rooms: "/api/rooms",
            penghuni: "/api/penghuni",
            devices: "/api/devices",
            finance: "/api/finance",
            web2: "/api/web2 (Frontend Web2 Integration)"
        }
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/sensor", sensorRoutes);
app.use("/api/kos", kosRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/penghuni", penghuniRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/finance", financeRoutes);

// Web2 Frontend Integration Routes
app.use("/api/web2", web2Routes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

module.exports = app;