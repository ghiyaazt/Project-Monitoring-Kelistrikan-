require("dotenv").config();
const mongoose = require("mongoose");
const SensorData = require("./src/models/SensorData");

const testConnection = async () => {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB connected successfully!\n");

        // Cek jumlah data
        const count = await SensorData.countDocuments();
        console.log(`📊 Total data in database: ${count}\n`);

        // Ambil 5 data terbaru
        console.log("📋 Latest 5 data from database:");
        const latestData = await SensorData.find()
            .sort({ timestamp: -1 })
            .limit(5);

        latestData.forEach((data, index) => {
            console.log(`\n${index + 1}. Data at ${data.timestamp}`);
            console.log(`   Device ID: ${data.device_id}`);
            console.log(`   Voltage: ${data.voltage}V`);
            console.log(`   Current: ${data.current}A`);
            console.log(`   Power: ${data.power}W`);
            console.log(`   Energy: ${data.energy}kWh`);
            console.log(`   Status: ${data.status}`);
            console.log(`   Relay: ${data.relay_status}`);
        });

        console.log("\n✅ Test completed!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

testConnection();
