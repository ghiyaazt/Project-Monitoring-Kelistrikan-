const express = require("express");

const {
    createSensorData,
    getLatestData,
    getAllData,
    getDataByDevice,
    getStatistics,
    getDataByDateRange
} = require("../controllers/sensorController");

const router = express.Router();

// POST - Create sensor data manually
router.post("/", createSensorData);

// GET - Latest data
router.get("/latest", getLatestData);

// GET - All data with pagination
router.get("/all", getAllData);

// GET - Statistics
router.get("/stats", getStatistics);

// GET - Data by device ID
router.get("/device/:device_id", getDataByDevice);

// GET - Data by date range
router.get("/range", getDataByDateRange);

module.exports = router;