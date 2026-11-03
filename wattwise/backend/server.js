require("dotenv").config();

const app = require("./src/app");
const { connectDatabase } = require("./src/config/database");
const { connectMQTT, disconnectMQTT } = require("./src/config/mqtt");
const { subscribeToPZEMData } = require("./src/services/mqttService");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to MongoDB (both main and IoT databases)
        await connectDatabase();

        // Connect to MQTT Broker (only if enabled)
        const mqttEnabled = process.env.MQTT_ENABLED !== 'false';
        
        if (mqttEnabled) {
            console.log("📡 MQTT is ENABLED - Connecting to broker...");
            connectMQTT();
            subscribeToPZEMData();
        } else {
            console.log("⚠️  MQTT is DISABLED - Running in Web/Mobile API only mode");
            console.log("💡 To enable MQTT, set MQTT_ENABLED=true in .env");
        }

        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 WattWise Backend running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 API URL: http://localhost:${PORT}`);
            console.log(`🔌 MQTT Status: ${mqttEnabled ? 'ENABLED' : 'DISABLED'}`);
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