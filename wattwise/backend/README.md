# 🔋 WattWise Backend - Electrical Monitoring System

Backend system untuk monitoring kelistrikan real-time menggunakan ESP32 + PZEM-004T dengan integrasi MQTT dan MongoDB.

---

## ✅ Status Koneksi

| Component | Status | Details |
|-----------|--------|---------|
| **MQTT** | ✅ Connected | broker.hivemq.com:1883 |
| **MongoDB** | ✅ Connected | MongoDB Atlas Cloud |
| **Express API** | ✅ Running | Port 5000 |
| **ESP32** | ✅ Sending Data | Topic: pzem/data |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
File `.env` sudah dikonfigurasi:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
MQTT_BROKER_URL=mqtt://broker.hivemq.com
MQTT_PORT=1883
MQTT_CLIENT_ID=wattwise-backend-01
MQTT_TOPIC_SUBSCRIBE=pzem/data
```

### 3. Run Backend
```bash
npm start
```

### 4. Test Database Connection
```bash
npm run test:db
```

---

## 📊 Data Flow

```
ESP32 (PZEM-004T) 
    ↓ (Publish MQTT)
HiveMQ Broker (pzem/data)
    ↓ (Subscribe)
Backend Node.js
    ↓ (Save)
MongoDB Atlas
    ↓ (Query via REST API)
Mobile App / Dashboard
```

---

## 📡 MQTT Integration

### Koneksi
- **Broker**: broker.hivemq.com
- **Port**: 1883
- **Topic Subscribe**: `pzem/data`
- **Client ID**: wattwise-backend-01

### Data Format dari ESP32
```json
{
  "event": "pzem_data",
  "status": "NORMAL",
  "current": 0,
  "voltage": 232.7,
  "power": 0,
  "energy": 0.095,
  "time_delay_val": 0,
  "relay_status_val": "ON",
  "curva_type": "Normal Inverse"
}
```

### Status yang Tersimpan
✅ Data diterima real-time dari ESP32  
✅ Otomatis tersimpan ke MongoDB  
✅ Reconnect otomatis jika koneksi terputus  
✅ Error handling & logging lengkap  

---

## 💾 MongoDB Schema

### Collection: `sensor_data`

```javascript
{
  device_id: String,          // "esp32-pzem-01"
  room_id: String,            // "room-01"
  
  // Data PZEM-004T
  voltage: Number,            // Tegangan (V)
  current: Number,            // Arus (A)
  power: Number,              // Daya (W)
  energy: Number,             // Energi (kWh)
  
  // Data ESP32
  event: String,              // "pzem_data"
  status: String,             // "NORMAL" | "OVERLOAD" | "WARNING"
  relay_status: String,       // "ON" | "OFF"
  time_delay_val: Number,     // Delay time
  curva_type: String,         // "Normal Inverse"
  motion: Boolean,            // Sensor gerak (PIR)
  
  timestamp: Date,            // Waktu data masuk
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

### Total Data Tersimpan
Saat ini: **18 records** dan terus bertambah otomatis! 📈

---

## 🌐 REST API Endpoints

### 1. Health Check
```http
GET http://localhost:5000/
```

Response:
```json
{
  "message": "WattWise Backend is running!"
}
```

### 2. Get Latest Sensor Data
```http
GET http://localhost:5000/api/sensor/latest
```

### 3. Get All Sensor Data
```http
GET http://localhost:5000/api/sensor/all
```

### 4. Get Data by Device ID
```http
GET http://localhost:5000/api/sensor/device/:device_id
```

### 5. Get Data by Date Range
```http
GET http://localhost:5000/api/sensor/range?start=2026-09-01&end=2026-09-08
```

---

## 🧪 Testing

### Test 1: Database Connection
```bash
npm run test:db
```

Output:
```
✅ MongoDB connected successfully!
📊 Total data in database: 18
📋 Latest 5 data from database
```

### Test 2: MQTT Publish Manual
Gunakan MQTTX atau mosquitto_pub:
```bash
mosquitto_pub -h broker.hivemq.com -t "pzem/data" -m '{"voltage":220,"current":2.5,"power":550,"energy":1.5}'
```

### Test 3: Check Logs
Server akan menampilkan:
```
✅ MQTT Connected successfully!
📬 Subscribed to MQTT topic: pzem/data
📩 Received MQTT data: {...}
💾 Data saved to MongoDB: {...}
```

---

## 📁 Project Structure

```
backend/
├── server.js                 # Entry point
├── src/
│   ├── app.js               # Express app setup
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── mqtt.js          # MQTT configuration
│   ├── models/
│   │   └── SensorData.js    # MongoDB schema
│   ├── controllers/
│   │   └── sensorController.js
│   ├── routes/
│   │   └── sensorRoutes.js
│   └── services/
│       └── mqttService.js   # MQTT subscribe & save
├── testConnection.js        # Test DB script
├── .env                     # Environment variables
└── package.json
```

---

## 🔧 Scripts Available

```bash
npm start       # Jalankan server
npm run dev     # Jalankan dengan nodemon (auto-reload)
npm run test:db # Test koneksi database
```

---

## 📈 Monitoring

### Real-time Logs
Server menampilkan log untuk setiap operasi:
- 🔌 MQTT connection status
- 📩 Data received dari ESP32
- 💾 Data saved to MongoDB
- ❌ Error jika ada masalah

### Database Monitoring
Gunakan MongoDB Compass atau Atlas UI untuk melihat data real-time:
- **Database**: Cluster0
- **Collection**: sensor_data

---

## 🐛 Troubleshooting

### MQTT Connection Timeout
**Gejala**: `❌ MQTT Connection Error: connack timeout`  
**Penyebab**: Koneksi internet atau broker sedang overload  
**Solusi**: Backend otomatis reconnect, tunggu beberapa detik

### Data Tidak Tersimpan
**Gejala**: Data diterima tapi error saat save  
**Penyebab**: MongoDB connection issue  
**Solusi**: Cek koneksi MongoDB di `.env`

### ESP32 Tidak Terdetect
**Gejala**: Tidak ada log `📩 Received MQTT data`  
**Penyebab**: ESP32 belum publish atau topic salah  
**Solusi**: 
1. Cek ESP32 running
2. Pastikan topic: `pzem/data`
3. Test dengan MQTTX manual publish

---

## ✨ Features

✅ Real-time data ingestion via MQTT  
✅ Automatic data persistence to MongoDB  
✅ REST API for data query  
✅ Auto-reconnection for MQTT & MongoDB  
✅ Comprehensive error handling  
✅ Detailed logging system  
✅ Support untuk multiple devices  
✅ Timestamp tracking  
✅ Relay control monitoring  
✅ Status monitoring (NORMAL/OVERLOAD/WARNING)  

---

## 🎯 Next Steps

### 1. Mobile App Integration
Data sudah ready untuk diquery via REST API:
```javascript
// React Native / Flutter
fetch('http://your-server:5000/api/sensor/latest')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 2. Dashboard Web
Buat dashboard real-time dengan chart.js atau recharts

### 3. Alert System
Implementasi notifikasi jika status OVERLOAD

### 4. Historical Analysis
Query data by date range untuk analisis konsumsi listrik

---

## 📞 Support

Jika ada masalah:
1. Cek log server untuk error messages
2. Test database dengan `npm run test:db`
3. Verify MQTT connection via MQTTX
4. Check ESP32 serial monitor

---

## 🎉 Status Akhir

**MQTT + MongoDB Integration**: ✅ **SUKSES!**

Data dari ESP32 sudah:
- ✅ Diterima via MQTT real-time
- ✅ Tersimpan ke MongoDB Cloud
- ✅ Bisa diquery via REST API
- ✅ Ready untuk Mobile App

**Backend siap production! 🚀**


---

## 🔐 Authentication System

### Overview
Backend sudah dilengkapi dengan sistem authentication lengkap menggunakan JWT (JSON Web Token).

### Features
- ✅ **Register** - Daftar user baru
- ✅ **Login** - Login dengan email & password
- ✅ **Protected Routes** - Middleware untuk protect endpoint
- ✅ **Password Hashing** - Bcrypt untuk keamanan password
- ✅ **JWT Token** - Token berlaku 7 hari

### Database: users Collection

```javascript
{
  namaLengkap: String,        // "John Doe"
  email: String (unique),     // "john@example.com"
  nomorTelepon: String,       // "08123456789"
  password: String (hashed),  // Bcrypt hash
  role: String,               // "user" | "admin"
  isActive: Boolean,          // true/false
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

### Authentication Endpoints

#### 1. Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "namaLengkap": "John Doe",
  "email": "john@example.com",
  "nomorTelepon": "08123456789",
  "password": "password123",
  "konfirmasiPassword": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": "673a1b2c3d4e5f6a7b8c9d0e",
      "namaLengkap": "John Doe",
      "email": "john@example.com",
      "nomorTelepon": "08123456789",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Login User
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "673a1b2c3d4e5f6a7b8c9d0e",
      "namaLengkap": "John Doe",
      "email": "john@example.com",
      "nomorTelepon": "08123456789",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Get User Profile (Protected)
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "673a1b2c3d4e5f6a7b8c9d0e",
    "namaLengkap": "John Doe",
    "email": "john@example.com",
    "nomorTelepon": "08123456789",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### Testing Authentication

```bash
# Jalankan test authentication (pastikan server running)
node testAuth.js
```

Output akan menampilkan:
- ✅ Register test
- ✅ Login test
- ✅ Get profile test
- ✅ Invalid login test

### Protected Routes Usage

Untuk protect endpoint agar hanya user yang login bisa akses:

```javascript
const { protect } = require('./middlewares/authMiddleware');

// Example: Protect sensor endpoint
router.get('/api/sensor/latest', protect, getSensorData);
```

### Security Notes

⚠️ **Production Checklist:**
1. ✅ Password di-hash dengan bcrypt (salt rounds: 10)
2. ✅ JWT token dengan expiration (7 hari)
3. ⚠️ Ganti `JWT_SECRET` di .env dengan random string yang lebih secure
4. ⚠️ Gunakan HTTPS untuk production
5. ⚠️ Implementasi rate limiting untuk prevent brute force
6. ⚠️ Tambahkan email verification (optional)

### API Documentation

Dokumentasi lengkap authentication API ada di file:
📖 **[API_AUTH_DOCS.md](./API_AUTH_DOCS.md)**

---
