const SensorData = require("../models/SensorData");

const createSensorData = async (req, res) => {
    try {
        const sensorData = await SensorData.create(req.body);

        res.status(201).json({
            success: true,
            message: "Sensor data saved successfully",
            data: sensorData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createSensorData
};