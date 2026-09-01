const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema(
    {
        device_id: {
            type: String,
            required: true
        },

        room_id: {
            type: String,
            required: true
        },

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

        motion: {
            type: Boolean,
            required: true
        },

        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "sensor_data"
    }
);

module.exports = mongoose.model("SensorData", sensorDataSchema);