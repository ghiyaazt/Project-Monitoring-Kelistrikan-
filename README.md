# ⚡ WattWise - Smart Electrical Monitoring System

<div align="center">

![WattWise Banner](https://img.shields.io/badge/WattWise-Electrical%20Monitoring-blue?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![MQTT](https://img.shields.io/badge/MQTT-HiveMQ-orange?style=for-the-badge&logo=mqtt)](https://www.hivemq.com/)

**Sistem monitoring kelistrikan real-time berbasis IoT dengan ESP32 + PZEM-004T**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Tentang Project

**WattWise** adalah sistem monitoring kelistrikan pintar yang memungkinkan Anda memantau konsumsi listrik secara real-time melalui aplikasi mobile dan web dashboard. Project ini mengintegrasikan hardware IoT (ESP32 + sensor PZEM-004T) dengan backend Node.js, database MongoDB, dan protokol MQTT untuk komunikasi real-time.

### 🎯 Tujuan Project
- 📊 **Monitoring Real-time**: Pantau tegangan, arus, daya, dan energi secara langsung
- 🔔 **Alert System**: Notifikasi otomatis saat terjadi overload atau anomali
- 📈 **Analisis Historis**: Lacak pola konsumsi listrik untuk optimasi penggunaan
- 💰 **Hemat Biaya**: Identifikasi pemborosan energi dan kurangi tagihan listrik
- 🏠 **Multi-Room Support**: Monitor beberapa ruangan dari satu aplikasi

---

## ✨ Features

### 🔋 Hardware Integration
- ✅ ESP32 sebagai mikrokontroler utama
- ✅ PZEM-004T untuk pengukuran listrik akurat
- ✅ Sensor PIR untuk deteksi gerak (opsional)
- ✅ Relay control untuk automasi on/off

### 📡 Backend System
- ✅ Real-time data ingestion via MQTT protocol
- ✅ RESTful API untuk akses data
- ✅ MongoDB Atlas untuk cloud storage
- ✅ Auto-reconnection & error handling
- ✅ Comprehensive logging system

### 📱 Mobile & Web App
- ✅ Dashboard monitoring real-time
- ✅ Grafik konsumsi listrik per jam/hari/bulan
- ✅ Notifikasi push untuk alert
- ✅ Manajemen multiple devices
- ✅ Riwayat pembayaran & tagihan
- ✅ Pengaturan profil & preferensi

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────┐
│   ESP32 + PZEM  │  Hardware Layer
│   Sensor Data   │
└────────┬────────┘
         │ MQTT Publish (pzem/data)
         ↓
┌─────────────────┐
│  HiveMQ Broker  │  Message Broker
│  (Cloud MQTT)   │
└────────┬────────┘
         │ MQTT Subscribe
         ↓
┌─────────────────┐
│  Node.js Backend│  Application Layer
│  Express + MQTT │
└────────┬────────┘
         │ Save Data
         ↓
┌─────────────────┐
│  MongoDB Atlas  │  Database Layer
│  Cloud Database │
└────────┬────────┘
         │ REST API Query
         ↓
┌─────────────────┐
│ Mobile/Web App  │  Presentation Layer
│  React Native   │
└─────────────────┘
```

---

## 📊 Data Flow

### 📥 Input (dari ESP32)
```json
{
  "event": "pzem_data",
  "status": "NORMAL",
  "voltage": 232.7,
  "current": 2.45,
  "power": 570.0,
  "energy": 1.25,
  "relay_status_val": "ON",
  "time_delay_val": 0,
  "curva_type": "Normal Inverse",
  "motion": true
}
```

### 📤 Output (API Response)
```json
{
  "device_id": "esp32-pzem-01",
  "room_id": "room-01",
  "voltage": 232.7,
  "current": 2.45,
  "power": 570.0,
  "energy": 1.25,
  "status": "NORMAL",
  "relay_status": "ON",
  "timestamp": "2026-09-22T10:30:00.000Z"
}
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas))
- MQTT Broker access (HiveMQ default)
- ESP32 dengan firmware PZEM-004T

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/Project-Monitoring-Kelistrikan.git
cd Project-Monitoring-Kelistrikan
```

### 2️⃣ Setup Backend
```bash
cd wattwise/backend
npm install
```

### 3️⃣ Configure Environment
Buat file `.env` di folder `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wattwise
MQTT_BROKER_URL=mqtt://broker.hivemq.com
MQTT_PORT=1883
MQTT_CLIENT_ID=wattwise-backend-01
MQTT_TOPIC_SUBSCRIBE=pzem/data
```

### 4️⃣ Run Backend Server
```bash
npm start
```

✅ Server akan berjalan di `http://localhost:5000`

### 5️⃣ Test Connection
```bash
npm run test:db
```

---

## 📱 Mobile App Setup

### Frontend Installation
```bash
cd wattwise/tampilan\ wattwise
npm install
```

### Run Development
```bash
npm start
# atau
expo start  # jika menggunakan Expo
```

---

## 🌐 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Health Check
```http
GET /
```
Response:
```json
{
  "message": "WattWise Backend is running!"
}
```

#### 2. Get Latest Data
```http
GET /api/sensor/latest
```
Response: Data sensor terbaru dari semua devices

#### 3. Get All Data
```http
GET /api/sensor/all
```
Response: Semua data historis

#### 4. Get Data by Device
```http
GET /api/sensor/device/:device_id
```
Example: `/api/sensor/device/esp32-pzem-01`

#### 5. Get Data by Date Range
```http
GET /api/sensor/range?start=2026-09-01&end=2026-09-22
```

---

## 📁 Project Structure

```
Project-Monitoring-Kelistrikan/
│
├── wattwise/
│   │
│   ├── backend/                    # Node.js Backend
│   │   ├── src/
│   │   │   ├── config/            # Database & MQTT config
│   │   │   ├── models/            # MongoDB schemas
│   │   │   ├── controllers/       # Business logic
│   │   │   ├── routes/            # API routes
│   │   │   └── services/          # MQTT service
│   │   ├── server.js              # Entry point
│   │   ├── package.json
│   │   └── .env
│   │
│   └── tampilan wattwise/         # Frontend (Mobile/Web)
│       ├── components/            # UI Components
│       │   ├── Dashboard.tsx      # Main dashboard
│       │   ├── Monitoring.tsx     # Real-time monitoring
│       │   ├── Electricity.tsx    # Energy analytics
│       │   ├── Anomali.tsx        # Anomaly detection
│       │   ├── Notifikasi.tsx     # Notifications
│       │   └── ...
│       ├── hooks/                 # Custom React hooks
│       ├── data/                  # Mock data & types
│       └── App.tsx                # Root component
│
└── README.md                      # This file
```

---

## 🔧 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Protocol**: MQTT (HiveMQ Broker)
- **Libraries**:
  - `mqtt` - MQTT client
  - `mongoose` - MongoDB ODM
  - `express` - Web framework
  - `cors` - Cross-origin resource sharing
  - `dotenv` - Environment configuration

### Frontend
- **Framework**: React Native / React
- **Language**: TypeScript
- **UI Components**: Custom components
- **State Management**: React Hooks
- **Charts**: Recharts / Victory Native

### Hardware
- **Microcontroller**: ESP32
- **Sensor**: PZEM-004T (Energy monitoring)
- **Additional**: PIR Sensor, Relay Module

---

## 📈 Monitoring Dashboard

### Key Metrics
- ⚡ **Voltage** (V): Real-time voltage monitoring
- 🔌 **Current** (A): Current consumption
- 💡 **Power** (W): Instantaneous power usage
- 📊 **Energy** (kWh): Cumulative energy consumption
- 🔔 **Status**: NORMAL / WARNING / OVERLOAD
- 🎚️ **Relay**: ON / OFF state

### Analytics Features
- 📉 Grafik konsumsi per jam
- 📅 Laporan harian/mingguan/bulanan
- 💰 Estimasi biaya listrik
- 🏆 Perbandingan penggunaan antar ruangan
- 🔍 Deteksi anomali konsumsi

---

## 🧪 Testing

### Backend Testing
```bash
# Test database connection
npm run test:db

# Manual MQTT publish test
mosquitto_pub -h broker.hivemq.com -t "pzem/data" -m '{"voltage":220,"current":2.5,"power":550}'
```

### Expected Output
```
✅ MQTT Connected successfully!
📬 Subscribed to MQTT topic: pzem/data
📩 Received MQTT data: {...}
💾 Data saved to MongoDB
✅ MongoDB connected successfully!
📊 Total data in database: 18
```

---

## 🐛 Troubleshooting

### Backend tidak bisa connect ke MongoDB
**Solusi**: 
- Pastikan `MONGODB_URI` di `.env` sudah benar
- Whitelist IP address di MongoDB Atlas
- Cek koneksi internet

### Data tidak masuk dari ESP32
**Solusi**:
- Verifikasi ESP32 terkoneksi ke WiFi
- Cek topic MQTT sudah sesuai: `pzem/data`
- Test dengan MQTTX atau mosquitto client

### MQTT Connection Timeout
**Solusi**:
- Backend akan auto-reconnect
- Coba broker MQTT alternatif jika HiveMQ down
- Pastikan firewall tidak block port 1883

---

## 🎯 Roadmap

### ✅ Phase 1 (Done)
- [x] ESP32 + PZEM-004T integration
- [x] MQTT communication setup
- [x] MongoDB database design
- [x] Backend REST API
- [x] Basic mobile UI components

### 🚧 Phase 2 (In Progress)
- [ ] Complete mobile app integration
- [ ] Real-time charts implementation
- [ ] Push notification system
- [ ] User authentication & authorization

### 📋 Phase 3 (Planned)
- [ ] Multi-user support
- [ ] Advanced analytics & ML predictions
- [ ] Web dashboard
- [ ] Billing & payment integration
- [ ] Export reports (PDF/Excel)

### 🔮 Future Ideas
- [ ] Voice control (Google Assistant/Alexa)
- [ ] Smart automation rules
- [ ] Solar panel integration
- [ ] Carbon footprint calculator

---

## 🤝 Contributing

Contributions are welcome! Berikut cara berkontribusi:

1. Fork repository ini
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Contribution Guidelines
- Ikuti code style yang sudah ada
- Tambahkan tests untuk fitur baru
- Update dokumentasi jika diperlukan
- Jelaskan perubahan secara detail di PR description

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Project ini dikembangkan oleh:
- **Developer**: Your Name
- **Hardware Engineer**: Team Member
- **UI/UX Designer**: Team Member

---

## 📞 Contact & Support

- 📧 Email: your.email@example.com
- 💬 Discord: [Join our server](https://discord.gg/yourserver)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/Project-Monitoring-Kelistrikan/issues)
- 📚 Wiki: [Documentation](https://github.com/yourusername/Project-Monitoring-Kelistrikan/wiki)

---

## 🙏 Acknowledgments

- [ESP32 Community](https://www.espressif.com/) - Hardware support
- [HiveMQ](https://www.hivemq.com/) - Free MQTT broker
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database
- [Node.js](https://nodejs.org/) - Backend runtime
- All contributors and testers

---

## 📸 Screenshots

### Dashboard
<img src="screenshots/dashboard.png" width="300" alt="Dashboard">

### Monitoring Real-time
<img src="screenshots/monitoring.png" width="300" alt="Monitoring">

### Analytics
<img src="screenshots/analytics.png" width="300" alt="Analytics">

> Note: Add screenshots to `/screenshots` folder

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/Project-Monitoring-Kelistrikan&type=Date)](https://star-history.com/#yourusername/Project-Monitoring-Kelistrikan&Date)

---

<div align="center">

### 🌟 Don't forget to star this repo if you find it useful! 🌟

**Made with ❤️ and ⚡ by WattWise Team**

[⬆ Back to Top](#-wattwise---smart-electrical-monitoring-system)

</div>
