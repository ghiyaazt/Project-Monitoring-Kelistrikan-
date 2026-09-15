const SensorData = require("../models/SensorData");

// Create sensor data (via API)
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

// Get latest sensor data
const getLatestData = async (req, res) => {
    try {
        const latestData = await SensorData.findOne()
            .sort({ timestamp: -1 })
            .limit(1);

        res.status(200).json({
            success: true,
            data: latestData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all sensor data with pagination
const getAllData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const total = await SensorData.countDocuments();
        const data = await SensorData.find()
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
            count: data.length,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get data by device ID
const getDataByDevice = async (req, res) => {
    try {
        const { device_id } = req.params;
        const limit = parseInt(req.query.limit) || 50;

        const data = await SensorData.find({ device_id })
            .sort({ timestamp: -1 })
            .limit(limit);

        res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get data statistics
const getStatistics = async (req, res) => {
    try {
        const total = await SensorData.countDocuments();
        const latest = await SensorData.findOne().sort({ timestamp: -1 });
        
        // Get average values
        const stats = await SensorData.aggregate([
            {
                $group: {
                    _id: null,
                    avgVoltage: { $avg: "$voltage" },
                    avgCurrent: { $avg: "$current" },
                    avgPower: { $avg: "$power" },
                    totalEnergy: { $sum: "$energy" },
                    maxPower: { $max: "$power" },
                    minPower: { $min: "$power" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            statistics: {
                totalRecords: total,
                latestData: latest,
                averages: stats[0] || {},
                lastUpdated: latest?.timestamp
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get data by date range
const getDataByDateRange = async (req, res) => {
    try {
        const { start, end } = req.query;
        
        if (!start || !end) {
            return res.status(400).json({
                success: false,
                message: "Please provide start and end date (format: YYYY-MM-DD)"
            });
        }

        const data = await SensorData.find({
            timestamp: {
                $gte: new Date(start),
                $lte: new Date(end)
            }
        }).sort({ timestamp: -1 });

        res.status(200).json({
            success: true,
            count: data.length,
            dateRange: { start, end },
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createSensorData,
    getLatestData,
    getAllData,
    getDataByDevice,
    getStatistics,
    getDataByDateRange
};