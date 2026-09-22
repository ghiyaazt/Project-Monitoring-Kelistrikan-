const mongoose = require("mongoose");

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
        }
    },
    {
        collection: "sensor_data",
        timestamps: true, // Tambahan createdAt & updatedAt
        versionKey: false // Disable __v field
    }
);

module.exports = mongoose.model("SensorData", sensorDataSchema);