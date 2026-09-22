const express = require("express");
const cors = require("cors");

const sensorRoutes = require("./routes/sensorRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "WattWise Backend is running!"
    });
});

app.use("/api/sensor", sensorRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;