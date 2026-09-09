# 🔌 MQTT Integration Setup - WattWise Backend

## ✅ Implementasi Selesai!

Backend sudah terintegrasi dengan MQTT broker HiveMQ dan siap menerima data dari ESP32.

---

## 📋 Yang Sudah Diimplementasikan

### 1. **Dependencies Terinstall**
- ✅ `mqtt` package (v5.15.2)

### 2. **File Yang Dibuat**
- ✅ `src/config/mqtt.js` - Konfigurasi dan koneksi MQTT
- ✅ `src/services/mqttService.js` - Service untuk subscribe dan simpan data
- ✅ `.env` - Konfigurasi MQTT ditambahkan

### 3. **File Yang Dimodifikasi**
- ✅ `server.js` - Inisialisasi MQTT saat server start
- ✅ `package.json` - Script untuk menjalankan server

---

## 🚀 Cara Menjalankan

### 1. Start Backend
```bash
cd backend
npm start
```

### 2. Output yang Diharapkan
```
🔌 Connecting to MQTT Broker: mqtt://broker.hivemq.com:1883
Connected to MongoDB
✅ MQTT Connected successfully!
📡 Client ID: wattwise-backend-01
📬 Subscribed to MQTT topic: pzem/data
🚀 WattWise Backend running on port 5000
```

### 3. Ketika ESP32 Mengirim Data
```
📩 Received MQTT data: { voltage: 220, current: 2.5, power: 550, ... }
💾 Data saved to MongoDB: { device_id: 'esp32-pzem-01', voltage: 220, ... }
```

---

## 🔧 Konfigurasi MQTT (.env)

```env
MQTT_BROKER_URL=mqtt://broker.hivemq.com
MQTT_PORT=1883
MQTT_CLIENT_ID=wattwise-backend-01
MQTT_TOPIC_SUBSCRIBE=pzem/data
MQTT_USERNAME=
MQTT_PASSWORD=
```

**Sesuai dengan ESP32:**
- ✅ Broker: `broker.hivemq.com`
- ✅ Port: `1883`
- ✅ Topic: `pzem/data`

---

## 📡 Format Data dari ESP32

Backend akan menerima dan menyimpan data dengan format:

```json
{
  "device_id": "esp32-pzem-01",
  "room_id": "room-01",
  "voltage": 220.5,
  "current": 2.3,
  "power": 506.15,
  "energy": 1.25,
  "motion": false,
  "timestamp": "2026-09-08T10:30:00Z"
}
```

**Mapping ke Database:**
- `device_id` → String (default: "esp32-pzem-01")
- `room_id` → String (default: "room-01")
- `voltage` → Number (dari PZEM)
- `current` → Number (dari PZEM)
- `power` → Number (dari PZEM)
- `energy` → Number (dari PZEM)
- `motion` → Boolean (default: false)
- `timestamp` → Date (auto-generated jika tidak ada)

---

## 🧪 Testing MQTT

### Opsi 1: Menggunakan MQTTX (Recommended)
1. Download MQTTX: https://mqttx.app/
2. Connect ke `broker.hivemq.com:1883`
3. Publish ke topic `pzem/data` dengan payload:
```json
{
  "device_id": "test-device",
  "room_id": "test-room",
  "voltage": 220,
  "current": 2.5,
  "power": 550,
  "energy": 1.5,
  "motion": true
}
```

### Opsi 2: Menggunakan Mosquitto Client
```bash
mosquitto_pub -h broker.hivemq.com -t "pzem/data" -m '{"voltage":220,"current":2.5,"power":550,"energy":1.5}'
```

### Opsi 3: Langsung dari ESP32
Pastikan ESP32 sudah running dan mengirim data.

---

## 📊 Cara Cek Data Masuk

### 1. Via REST API
```bash
GET http://localhost:5000/api/sensor/latest
GET http://localhost:5000/api/sensor/all
```

### 2. Via MongoDB Compass
- Connect ke database MongoDB
- Lihat collection `sensor_data`

### 3. Via Console Log
Backend akan print setiap data yang masuk:
```
📩 Received MQTT data: ...
💾 Data saved to MongoDB: ...
```

---

## 🎯 Fitur yang Sudah Tersedia

### ✅ Subscribe MQTT
- Otomatis subscribe ke topic `pzem/data`
- Handle reconnection otomatis
- Error handling

### ✅ Save to Database
- Parse JSON dari MQTT
- Validasi data
- Simpan ke MongoDB
- Log setiap operasi

### ✅ Graceful Shutdown
- CTRL+C untuk stop server
- Otomatis disconnect dari MQTT
- Clean exit

---

## 🐛 Troubleshooting

### Backend tidak connect ke MQTT?
1. Cek koneksi internet
2. Pastikan broker `broker.hivemq.com` tidak down
3. Cek log error di console

### Data tidak tersimpan?
1. Cek MongoDB connection
2. Cek format JSON dari ESP32
3. Lihat error di console log

### ESP32 tidak terdetect?
1. Pastikan ESP32 sudah running
2. Cek ESP32 publish ke topic `pzem/data`
3. Test publish manual via MQTTX

---

## 📝 Next Steps

### 1. Update ESP32 Code (Opsional)
Pastikan ESP32 mengirim field yang lengkap:
```cpp
// Tambahkan di JSON payload ESP32
"device_id": "esp32-pzem-01",
"room_id": "room-01",
"motion": false  // atau baca dari sensor PIR
```

### 2. Publish dari Backend ke ESP32 (Opsional)
Untuk kontrol device dari backend:
```javascript
const { publishMessage } = require('./src/services/mqttService');

// Contoh: kirim command ke ESP32
publishMessage('pzem/control', {
  command: 'reset',
  device_id: 'esp32-pzem-01'
});
```

---

## 🎉 Done!

Backend sekarang:
- ✅ Terhubung ke MQTT broker HiveMQ
- ✅ Subscribe ke topic `pzem/data`
- ✅ Menerima data dari ESP32 secara real-time
- ✅ Menyimpan data ke MongoDB
- ✅ Siap diintegrasikan dengan mobile app

**Tinggal jalankan ESP32 dan data akan masuk otomatis! 🚀**
