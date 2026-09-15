require("dotenv").config();

const app = require("./src/app");
const connectDatabase = require("./src/config/database");
const { connectMQTT, disconnectMQTT } = require("./src/config/mqtt");
const { subscribeToPZEMData } = require("./src/services/mqttService");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDatabase();

        // Connect to MQTT Broker
        connectMQTT();
        
        // Subscribe to sensor data topic
        subscribeToPZEMData();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 WattWise Backend running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down gracefully...");
    disconnectMQTT();
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("\n🛑 Shutting down gracefully...");
    disconnectMQTT();
    process.exit(0);
});

startServer();