const mqtt = require("mqtt");

const mqttConfig = {
    brokerUrl: process.env.MQTT_BROKER_URL || "mqtt://broker.hivemq.com",
    port: parseInt(process.env.MQTT_PORT) || 1883,
    clientId: process.env.MQTT_CLIENT_ID || `wattwise-backend-${Math.random().toString(16).slice(3)}`,
    username: process.env.MQTT_USERNAME || "",
    password: process.env.MQTT_PASSWORD || "",
    topicSubscribe: process.env.MQTT_TOPIC_SUBSCRIBE || "pzem/data"
};

let mqttClient = null;

const connectMQTT = () => {
    const options = {
        clientId: mqttConfig.clientId,
        clean: true,
        connectTimeout: 30000,        // 30 detik (lebih lama)
        reconnectPeriod: 5000,        // 5 detik (lebih lama, kurangi spam reconnect)
        keepalive: 60,                // Keepalive 60 detik
        protocolVersion: 4,           // MQTT 3.1.1
        reschedulePings: true         // Reschedule ping jika koneksi lambat
    };

    // Tambahkan username & password jika ada
    if (mqttConfig.username) {
        options.username = mqttConfig.username;
        options.password = mqttConfig.password;
    }

    const fullUrl = `${mqttConfig.brokerUrl}:${mqttConfig.port}`;
    
    console.log(`🔌 Connecting to MQTT Broker: ${fullUrl}`);
    mqttClient = mqtt.connect(fullUrl, options);

    // Event: Successfully connected
    mqttClient.on("connect", () => {
        console.log("✅ MQTT Connected successfully!");
        console.log(`📡 Client ID: ${mqttConfig.clientId}`);
    });

    // Event: Connection error
    mqttClient.on("error", (error) => {
        console.error("❌ MQTT Connection Error:", error.message);
    });

    // Event: Reconnecting
    mqttClient.on("reconnect", () => {
        console.log("🔄 MQTT Reconnecting... (this is normal if public broker is busy)");
    });

    // Event: Disconnected
    mqttClient.on("close", () => {
        console.log("🔌 MQTT Connection closed (will auto-reconnect)");
    });

    // Event: Offline
    mqttClient.on("offline", () => {
        console.log("📴 MQTT Client is offline");
    });

    return mqttClient;
};

const getMQTTClient = () => {
    if (!mqttClient) {
        throw new Error("MQTT client not initialized. Call connectMQTT() first.");
    }
    return mqttClient;
};

const disconnectMQTT = () => {
    if (mqttClient) {
        mqttClient.end();
        console.log("MQTT Client disconnected");
    }
};

module.exports = {
    connectMQTT,
    getMQTTClient,
    disconnectMQTT,
    mqttConfig
};
