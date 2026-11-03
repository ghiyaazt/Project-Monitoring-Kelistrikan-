const mongoose = require("mongoose");

// Create separate connections for different databases
let mainConnection = null;  // For wattwise database (users, auth, kos, rooms)
let iotConnection = null;   // For test database (IoT sensor data)

const connectDatabase = async () => {
    try {
        // Validate environment variables
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        // Connect to main database (wattwise) - for users, auth, kos, rooms, etc
        console.log("Connecting to main database (wattwise)...");
        mainConnection = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log("✅ Main MongoDB (wattwise) connected successfully");
        
        // Connect to IoT database (test) - for sensor data only
        if (process.env.MONGODB_IOT_URI) {
            console.log("Connecting to IoT database (test)...");
            iotConnection = mongoose.createConnection(process.env.MONGODB_IOT_URI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });

            iotConnection.on('connected', () => {
                console.log("✅ IoT MongoDB (test) connected successfully");
            });

            iotConnection.on('error', (err) => {
                console.error('❌ IoT MongoDB connection error:', err);
            });

            iotConnection.on('disconnected', () => {
                console.warn('⚠️  IoT MongoDB disconnected. Attempting to reconnect...');
            });

            iotConnection.on('reconnected', () => {
                console.log('✅ IoT MongoDB reconnected successfully');
            });
        } else {
            console.warn("⚠️  MONGODB_IOT_URI not set, IoT data will use main database");
        }
        
        // Main connection event listeners
        mongoose.connection.on('error', (err) => {
            console.error('❌ Main MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  Main MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ Main MongoDB reconnected successfully');
        });

    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        console.error("Full error:", error);
        process.exit(1);
    }
};

// Export both connections
const getMainConnection = () => mongoose.connection;
const getIoTConnection = () => iotConnection || mongoose.connection;

module.exports = {
    connectDatabase,
    getMainConnection,
    getIoTConnection
};