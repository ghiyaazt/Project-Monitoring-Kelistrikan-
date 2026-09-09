const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema(
    {
        device_id: {
            type: String,
            required: true
        },

        room_id: {
            type: String,
            default: "room-01"
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

        // Data tambahan dari ESP32
        event: {
            type: String,
            default: "pzem_data"
        },

        status: {
            type: String,
            enum: ["NORMAL", "OVERLOAD", "WARNING"],
            default: "NORMAL"
        },

        relay_status: {
            type: String,
            enum: ["ON", "OFF"],
            default: "OFF"
        },

        time_delay_val: {
            type: Number,
            default: 0
        },

        curva_type: {
            type: String,
            default: "Normal Inverse"
        },

        motion: {
            type: Boolean,
            default: false
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
        timestamps: true // Tambahan createdAt & updatedAt
    }
);

module.exports = mongoose.model("SensorData", sensorDataSchema);