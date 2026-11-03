const mongoose = require("mongoose");
const { getIoTConnection } = require("../config/database");

const sensorDataSchema = new mongoose.Schema(
    {
        device_id: {
            type: String,
            required: true
        },

        // Data dari PZEM-004T
        voltage: {
            type: Number,
            required: true
        },

        current: {
            type: Number,
            required: true
        },

        power: {
            type: Number,
            required: true
        },

        energy: {
            type: Number,
            required: true
        },

        // Field baru dari PZEM
        frequency: {
            type: Number,
            default: 50
        },

        powerfactor: {
            type: Number,
            default: 1.0
        },

        date: {
            type: String
        },

        timestamp: {
            type: Date,
            default: Date.now
        },

        timestampWIB: {
            type: Date
        }
    },
    {
        collection: "sensor_data",
        timestamps: true // Tambahan createdAt & updatedAt
    }
);

// Use IoT connection (test database) for sensor data
// This will be initialized after database connection is established
let SensorData;

// Export a function that returns the model with correct connection
const getSensorDataModel = () => {
    if (!SensorData) {
        const iotConnection = getIoTConnection();
        SensorData = iotConnection.model("SensorData", sensorDataSchema);
    }
    return SensorData;
};

// For backward compatibility, also export default model
// This will use the IoT connection if available
module.exports = {
    getSensorDataModel,
    // Default export for direct import
    default: mongoose.model("SensorData", sensorDataSchema)
};

// Also support CommonJS default export
module.exports = getSensorDataModel();