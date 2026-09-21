# WattWise - Sistem Monitoring Kelistrikan Berbasis IoT

Aplikasi web untuk monitoring konsumsi listrik real-time menggunakan sensor PZEM-004T dan mikrokontroler ESP32. Sistem ini memungkinkan monitoring daya, tegangan, dan arus listrik secara live melalui antarmuka web yang mudah digunakan.

## 🎯 Fitur Utama

### Dashboard Real-time
- Monitoring konsumsi daya (Watt), tegangan (Volt), dan arus (Ampere) secara live
- Grafik tren penggunaan listrik per hari/minggu/bulan
- Statistik total energi dan estimasi biaya
- Notifikasi anomali lonjakan/penurunan daya

### Monitoring Perangkat IoT
- Manajemen multi-device ESP32
- Status koneksi real-time
- Detail sensor per perangkat (daya, tegangan, arus)
- Riwayat konsumsi dan deteksi anomali
- Tambah/hapus perangkat secara dinamis

### Smart WattWise (Pengelompokan)
- Kelola perangkat dalam grup
- Monitoring agregat per grup
- Analisis efisiensi energi

### Pengaturan & Notifikasi
- Konfigurasi threshold anomali
- Manajemen preferensi notifikasi
- Pengaturan profil pengguna

## 🚀 Quick Start

### Prerequisites
- Node.js 14.x atau lebih baru
- npm atau yarn

### Instalasi

```bash
# Clone repository
git clone <repository-url>

# Masuk ke direktori project
cd wattwise

# Install dependencies
npm install

# Jalankan development server
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

### Build Production

```bash
npm run build
```

Output build akan tersimpan di folder `build/`

## 📁 Struktur Project

```
wattwise/
├── public/                 # Static assets
├── src/
│   ├── app/  
│   │   ├── index.tsx
│   ├── page/           # Page 
│   ├   ├── Dashboard/
│   │   │   ├── (Perfitur)/
│   ├── components/         # React components 
│   │   ├── Sidebar.tsx
│   ├── context/           # Context API (state management)
│   │   └── AppContext.tsx
│   ├── data/              # Mock data & types
│   │   └── mockData.ts
│   ├── styles/            # CSS modules (feature-based)
│   │   ├── auth/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── monitoring/
│   │   └── index.css
│   ├── app.tsx            # Main app component
│   └── index.tsx          # Entry point
├── package.json
└── README.md
```

## 🛠 Tech Stack

**Frontend:**
- React 18 (TypeScript)
- Recharts (grafik & visualisasi data)
- CSS Modules dengan CSS Variables (theming)
- Context API + localStorage (state management)

**Build Tools:**
- Create React App
- PostCSS + Autoprefixer
- TypeScript

**Hardware IoT:**
- ESP32 (mikrokontroler)
- PZEM-004T (sensor arus, tegangan, daya)
- Communication: MQTT/WebSocket (planned)

## 💾 State Management

Aplikasi menggunakan **Context API** dengan **localStorage** untuk persistence:

```typescript
// Access app state di component manapun
import { useApp } from './context/AppContext';

function MyComponent() {
  const { 
    iotDevices,      // List semua IoT devices
    currentUser,     // Data user yang login
    addDevice,       // Tambah device baru
    setUser          // Update user data
  } = useApp();
  
  // State otomatis persist ke localStorage
}
```

**Storage Keys:**
- `wattwise_user` - Data user authentication
- `wattwise_devices` - List IoT devices
- `wattwise_groups` - Smart WattWise groups

## 🎨 CSS Architecture

CSS menggunakan **CSS Variables** untuk theming yang konsisten dan mudah di-maintain:

**CSS Variables di `src/styles/index.css`:**
```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  
  /* Shadows, Radius, Transitions */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --radius-md: 0.5rem;
  --transition-normal: 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Struktur folder:**
```
styles/
├── auth/           # Login, Register
├── common/         # Buttons, inputs, badges, cards, modals
├── dashboard/      # Dashboard-specific styles
├── monitoring/     # Monitoring page
├── settings/       # Settings page
├── profil/         # Profile page
├── smartwattwise/  # Smart Wattwise grouping
└── index.css       # Entry point + CSS variables
```

## 🔐 Authentication

Login sederhana dengan email/password. Data user tersimpan di Context:

```typescript
interface User {
  name: string;
  email: string;
  deviceId: string;     // ESP32 device ID (e.g., "FC24-0041")
}
```

**Note:** Implementasi saat ini untuk demo. Untuk production, gunakan JWT dan backend authentication.

## 📊 Data Format

### IoT Device
```typescript
interface IoTDevice {
  id: string;
  name: string;           // Format: "ESP32 + {deviceId}"
  deviceId: string;       // e.g., "FC24-0041"
  status: "connected" | "disconnected" | "error";
  lastUpdate: string;
  location?: string;
  daya?: number;          // Watt
  tegangan?: number;      // Volt
  arus?: number;          // Ampere
}
```

### Anomaly Event
```typescript
interface AnomalyEvent {
  id: string;
  time: string;
  watt: number;
  watBefore: number;
  change: number;         // Percentage
  changeType: "spike" | "drop";
  status: "baru" | "ditangani";
  date: string;
  description: string;
}
```

## 🔧 Environment Variables

Buat file `.env` di root project (copy dari `.env.example`):

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_MQTT_BROKER=mqtt://localhost:1883
```

## 📱 Responsive Design

- Desktop: Full layout dengan sidebar
- Tablet: Collapsible sidebar  
- Mobile: Bottom navigation bar

## 🔌 Hardware Setup (ESP32 + PZEM-004T)

**Komponen yang dibutuhkan:**
- ESP32 Development Board
- Sensor PZEM-004T (AC current, voltage, power sensor)
- Kabel jumper
- Power supply

**Koneksi:**
```
PZEM-004T → ESP32
TX        → RX (GPIO 16)
RX        → TX (GPIO 17)
VCC       → 5V
GND       → GND
```

**Firmware ESP32:**
- Baca data dari PZEM-004T via Serial
- Kirim data ke backend via HTTP POST atau MQTT
- Update interval: 1-5 detik

## 🔧 Backend Integration (Planned)

**API Endpoints:**
```
POST /api/sensor-data    # Receive data from ESP32
GET  /api/devices        # Get list of devices
GET  /api/history        # Get historical data
POST /api/anomaly        # Report anomaly
```

**Data Format (JSON):**
```json
{
  "deviceId": "FC24-0041",
  "timestamp": "2026-09-20T10:42:31Z",
  "voltage": 220.5,
  "current": 2.21,
  "power": 486,
  "energy": 4.02,
  "frequency": 50.1,
  "powerFactor": 0.98
}
```

## 🚨 Known Issues & Limitations

1. **Mock Data:** Saat ini menggunakan mock data. Integrasi backend dengan ESP32 masih dalam development.
2. **Real-time Updates:** Simulasi live update setiap 3-5 detik. Untuk production, gunakan WebSocket/MQTT untuk komunikasi real-time.
3. **Authentication:** No backend validation. Semua login diterima untuk demo purposes.
4. **Deteksi Anomali:** Menggunakan threshold sederhana berdasarkan perubahan daya drastis (>50%).
5. **Storage:** localStorage digunakan untuk menyimpan state. Consider IndexedDB atau backend database untuk aplikasi production.

## 📄 License

Private project untuk keperluan monitoring listrik.

## 👤 Contact

Untuk pertanyaan atau support, hubungi tim developer.

---

**Version:** 0.1.0  
**Last Updated:** September 2026
