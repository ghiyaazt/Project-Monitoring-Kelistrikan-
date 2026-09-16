# WattWise - Sistem Monitoring Kelistrikan Berbasis IoT

Aplikasi web monitoring dan manajemen konsumsi listrik real-time untuk lingkungan kos dengan integrasi IoT menggunakan ESP32.

## 🎯 Fitur Utama

### Dashboard Real-time
- Monitoring konsumsi daya (Watt), tegangan (Volt), dan arus (Ampere) secara live
- Grafik tren penggunaan listrik per hari/minggu/bulan
- Statistik total energi dan biaya
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
- Pengaturan profil dan kamar

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
│   ├── components/         # React components
│   │   ├── Dashboard.tsx
│   │   ├── Monitoring.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Login.tsx
│   │   └── ...
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
- Recharts (grafik & visualisasi)
- Tailwind CSS (styling utility-first)
- Context API + localStorage (state persistence)

**Build Tools:**
- Create React App
- PostCSS + Autoprefixer
- TypeScript

**IoT Integration:**
- ESP32 dengan sensor PZEM-004T
- Communication protocol: MQTT/HTTP REST API (planned)

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

CSS diorganisir per fitur untuk kemudahan maintenance:

```
styles/
├── auth/           # Login, Register
├── common/         # Buttons, inputs, badges, cards, modals
├── dashboard/      # Dashboard-specific styles
├── monitoring/     # Monitoring page (8 modular files)
├── pengaturan/     # Settings page
└── index.css       # Entry point + Tailwind directives
```

Import di `src/index.tsx`:
```typescript
import './styles/index.css';  // Single entry point
```

## 🔐 Authentication

Login sederhana dengan email/password. Data user tersimpan di Context:

```typescript
interface User {
  name: string;
  kamar: string;
  email: string;
  deviceId: string;  // ESP32 device ID (e.g., "FC24-0041")
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
- Mobile: Bottom navigation (implementasi di folder `mobile/`)

## 🚨 Known Issues & Limitations

1. **Mock Data:** Saat ini menggunakan mock data. Integrasi backend API masih dalam development.
2. **Real-time Updates:** Simulasi live update setiap 3 detik. Untuk production, gunakan WebSocket/MQTT.
3. **Authentication:** No backend validation. Semua login diterima untuk demo purposes.
4. **Storage:** localStorage bisa penuh jika device terlalu banyak. Consider IndexedDB untuk scale.

## 📄 License

Private project untuk keperluan monitoring kos.

## 👤 Contact

Untuk pertanyaan atau support, hubungi tim developer.

---

**Version:** 0.1.0  
**Last Updated:** September 2026
