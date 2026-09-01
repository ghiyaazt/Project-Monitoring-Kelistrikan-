const express = require("express");

const {
    createSensorData
} = require("../controllers/sensorController");

const router = express.Router();

router.post("/", createSensorData);

module.exports = router;