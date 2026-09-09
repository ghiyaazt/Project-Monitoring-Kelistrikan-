const { getMQTTClient, mqttConfig } = require("../config/mqtt");
const SensorData = require("../models/SensorData");

/**
 * Subscribe ke topic MQTT dan handle data yang masuk
 */
const subscribeToPZEMData = () => {
    const client = getMQTTClient();
    const topic = mqttConfig.topicSubscribe;

    client.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
            console.error(`❌ Failed to subscribe to topic: ${topic}`, err);
            return;
        }
        console.log(`📬 Subscribed to MQTT topic: ${topic}`);
    });

    // Handle incoming messages
    client.on("message", async (receivedTopic, message) => {
        if (receivedTopic === topic) {
            try {
                // Parse data dari ESP32
                const data = JSON.parse(message.toString());
                console.log("📩 Received MQTT data:", data);

                // Simpan ke database
                await saveSensorData(data);
            } catch (error) {
                console.error("❌ Error processing MQTT message:", error.message);
                console.error("Raw message:", message.toString());
            }
        }
    });
};

/**
 * Simpan data sensor ke MongoDB
 * @param {Object} data - Data dari MQTT (dari ESP32)
 */
const saveSensorData = async (data) => {
    try {
        // Map data dari ESP32 ke schema MongoDB
        const sensorData = new SensorData({
            device_id: data.device_id || "esp32-pzem-01",
            room_id: data.room_id || "room-01",
            
            // Data PZEM
            voltage: data.voltage || 0,
            current: data.current || 0,
            power: data.power || 0,
            energy: data.energy || 0,
            frequency: data.frequency || 50,
            powerfactor: data.powerfactor || 1.0,
            
            // Data tambahan dari ESP32
            event: data.event || "pzem_data",
            status: data.status || "NORMAL",
            relay_status: data.relay_status_val || "OFF",
            time_delay_val: data.time_delay_val || 0,
            curva_type: data.curva_type || "Normal Inverse",
            motion: data.motion || false,
            date: data.date || new Date().toISOString().split('T')[0],
            
            timestamp: data.timestamp ? new Date(data.timestamp * 1000) : new Date()
        });

        await sensorData.save();
        console.log("💾 Data saved to MongoDB:", {
            device_id: sensorData.device_id,
            voltage: sensorData.voltage,
            current: sensorData.current,
            power: sensorData.power,
            energy: sensorData.energy,
            frequency: sensorData.frequency,
            powerfactor: sensorData.powerfactor
        });
    } catch (error) {
        console.error("❌ Error saving sensor data to DB:", error.message);
    }
};

/**
 * Publish message ke MQTT topic (opsional, untuk kontrol device)
 * @param {string} topic - Topic tujuan
 * @param {Object} message - Message yang akan di-publish
 */
const publishMessage = (topic, message) => {
    const client = getMQTTClient();
    
    const payload = JSON.stringify(message);
    
    client.publish(topic, payload, { qos: 1 }, (err) => {
        if (err) {
            console.error(`❌ Failed to publish to ${topic}:`, err);
            return;
        }
        console.log(`📤 Published to ${topic}:`, message);
    });
};

module.exports = {
    subscribeToPZEMData,
    publishMessage
};
