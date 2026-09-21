# 📚 MODUL BELAJAR - WattWise IoT Energy Monitor

Modul pembelajaran lengkap untuk memahami teknologi dan implementasi sistem WattWise.

---

## 📋 DAFTAR ISI

1. [Teknologi yang Digunakan](#1-teknologi-yang-digunakan)
2. [Struktur Project](#2-struktur-project)
3. [Penjelasan Sintaks & Fungsi](#3-penjelasan-sintaks--fungsi)
4. [Komponen Utama](#4-komponen-utama)
5. [Alur Data](#5-alur-data)
6. [Hardware IoT](#6-hardware-iot)
7. [Tips Presentasi](#7-tips-presentasi)

---

## 1. TEKNOLOGI YANG DIGUNAKAN

### 🎨 **Frontend Technologies**

#### A. **React 18** 
- **Apa itu**: Library JavaScript untuk membangun user interface
- **Kenapa dipakai**: Component-based, mudah maintain, fast rendering
- **Contoh penggunaan**:
```tsx
import { useState } from 'react';

function Dashboard() {
  const [data, setData] = useState(initialData);
  return <div>Dashboard Content</div>;
}
```

#### B. **TypeScript**
- **Apa itu**: JavaScript dengan type checking
- **Kenapa dipakai**: Menghindari error, code lebih aman, autocomplete lebih baik
- **Contoh penggunaan**:
```typescript
interface Device {
  id: string;
  name: string;
  watt: number;
  status: "aktif" | "mati";
}

const device: Device = {
  id: "d1",
  name: "Lampu",
  watt: 92,
  status: "aktif"
};
```

#### C. **CSS Variables**
- **Apa itu**: Variable untuk menyimpan nilai CSS yang bisa dipakai berulang
- **Kenapa dipakai**: Konsistensi warna, mudah ubah tema
- **Contoh penggunaan**:
```css
:root {
  --color-primary: #3b82f6;
  --spacing-md: 1rem;
}

.button {
  color: var(--color-primary);
  padding: var(--spacing-md);
}
```

#### D. **Recharts**
- **Apa itu**: Library untuk membuat chart/grafik
- **Kenapa dipakai**: Visualisasi data konsumsi listrik
- **Contoh penggunaan**:
```tsx
import { LineChart, Line, XAxis, YAxis } from 'recharts';

<LineChart data={chartData}>
  <Line type="monotone" dataKey="watt" stroke="#3b82f6" />
  <XAxis dataKey="time" />
  <YAxis />
</LineChart>
```

### 🔧 **Build Tools**

#### E. **Create React App (CRA)**
- **Apa itu**: Tool untuk setup project React otomatis
- **Kenapa dipakai**: Setup cepat, konfigurasi sudah optimal
- **Command**:
```bash
npx create-react-app wattwise --template typescript
npm start  # Jalankan development server
```

### 🔌 **Hardware & IoT**

#### F. **ESP32**
- **Apa itu**: Mikrokontroler dengan WiFi built-in
- **Kenapa dipakai**: Murah, bisa connect WiFi, cocok untuk IoT
- **Fungsi**: Membaca data dari sensor, kirim ke backend via HTTP/MQTT

#### G. **PZEM-004T**
- **Apa itu**: Sensor untuk mengukur listrik AC
- **Data yang diukur**:
  - Tegangan (Volt)
  - Arus (Ampere)
  - Daya (Watt)
  - Energi (kWh)
  - Power Factor
  - Frekuensi (Hz)

---

## 2. STRUKTUR PROJECT

```
wattwise/
├── public/                    # File statis
│   ├── index.html            # HTML utama
│   ├── logo192.png           # Logo untuk PWA
│   └── assets/logos/         # Logo WattWise
│
├── src/
│   ├── app/
│   │   ├── components/       # Komponen reusable
│   │   │   ├── Sidebar.tsx   # Menu navigasi
│   │   │   └── Logo.tsx      # Komponen logo
│   │   │
│   │   ├── page/             # Halaman aplikasi
│   │   │   ├── Login/        # Halaman login
│   │   │   ├── Register/     # Halaman register
│   │   │   ├── Dashboard/    # Halaman dashboard
│   │   │   ├── Monitoring/   # Halaman monitoring device
│   │   │   ├── SmartWattwise/# Halaman grouping
│   │   │   ├── Pengaturan/   # Halaman settings
│   │   │   └── Profil/       # Halaman profil user
│   │   │
│   │   └── index.tsx         # Main app component
│   │
│   ├── context/
│   │   └── AppContext.tsx    # State management global
│   │
│   ├── data/
│   │   └── mockData.ts       # Data dummy untuk testing
│   │
│   ├── styles/               # CSS files
│   │   ├── index.css         # CSS Variables global
│   │   ├── auth/             # Style login/register
│   │   ├── dashboard/        # Style dashboard
│   │   ├── monitoring/       # Style monitoring
│   │   ├── sidebar/          # Style sidebar
│   │   └── common/           # Style komponen umum
│   │
│   └── index.tsx             # Entry point aplikasi
│
├── package.json              # Dependencies & scripts
└── README.md                 # Dokumentasi project
```

---

## 3. PENJELASAN SINTAKS & FUNGSI

### 🔹 **React Hooks**

#### `useState` - Menyimpan Data
```tsx
import { useState } from 'react';

function Counter() {
  // [variabel, fungsi untuk ubah variabel]
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Tambah
      </button>
    </div>
  );
}
```
**Fungsi**: Menyimpan data yang bisa berubah (state)

#### `useEffect` - Jalankan Kode Saat Component Load
```tsx
import { useEffect, useState } from 'react';

function Dashboard() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Code ini jalan saat component pertama kali muncul
    fetchData();
  }, []); // [] = hanya jalan sekali
  
  return <div>{data}</div>;
}
```
**Fungsi**: Fetch data, setup timer, subscribe events

#### `useContext` - Ambil Data Global
```tsx
import { useContext } from 'react';
import { AppContext } from './context/AppContext';

function Sidebar() {
  const { currentUser, logout } = useContext(AppContext);
  
  return <div>Hello, {currentUser.name}</div>;
}
```
**Fungsi**: Akses state global tanpa props drilling

### 🔹 **TypeScript Interfaces**

```typescript
// Definisikan tipe data
interface Device {
  id: string;
  name: string;
  watt: number;
  status: "aktif" | "mati";  // Hanya bisa 2 nilai ini
}

// Gunakan interface
const lampu: Device = {
  id: "d1",
  name: "Lampu",
  watt: 92,
  status: "aktif"
};

// Function dengan type
function calculateTotal(devices: Device[]): number {
  return devices.reduce((sum, device) => sum + device.watt, 0);
}
```
**Fungsi**: Type safety, mencegah error, autocomplete

### 🔹 **Props & Component**

```tsx
// Definisi Props
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;  // Optional (?)
}

// Component dengan props
function Button({ text, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

// Cara pakai
<Button 
  text="Simpan" 
  onClick={() => alert('Saved!')} 
/>
```
**Fungsi**: Reusable component, passing data antar component

### 🔹 **Conditional Rendering**

```tsx
function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tampilkan loading
  if (loading) return <div>Loading...</div>;
  
  // Tampilkan error
  if (error) return <div>Error: {error}</div>;
  
  // Tampilkan konten
  return <div>Dashboard Content</div>;
}
```

### 🔹 **Array Methods**

```typescript
const devices = [
  { name: "Lampu", watt: 92 },
  { name: "Kipas", watt: 240 },
  { name: "Laptop", watt: 128 }
];

// 1. map() - Transform array
const deviceNames = devices.map(d => d.name);
// ["Lampu", "Kipas", "Laptop"]

// 2. filter() - Saring data
const highPower = devices.filter(d => d.watt > 100);
// [{ name: "Kipas", watt: 240 }, { name: "Laptop", watt: 128 }]

// 3. reduce() - Hitung total
const totalWatt = devices.reduce((sum, d) => sum + d.watt, 0);
// 460

// 4. find() - Cari 1 item
const kipas = devices.find(d => d.name === "Kipas");
// { name: "Kipas", watt: 240 }

// 5. forEach() - Loop untuk setiap item
devices.forEach(d => {
  console.log(`${d.name}: ${d.watt}W`);
});
```

### 🔹 **LocalStorage**

```typescript
// Simpan data
localStorage.setItem('user', JSON.stringify({ name: 'John' }));

// Ambil data
const userData = JSON.parse(localStorage.getItem('user'));

// Hapus data
localStorage.removeItem('user');

// Hapus semua
localStorage.clear();
```
**Fungsi**: Simpan data di browser, tetap ada meskipun refresh

---

## 4. KOMPONEN UTAMA

### A. **Login Component** (`Login.tsx`)

**Fungsi**: Halaman login user

**Sintaks Penting**:
```tsx
function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();  // Prevent page reload
    
    // Validasi
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }
    
    // Simpan user ke context
    setUser({ name: email, email: email });
    
    // Redirect ke dashboard
    onLogin();
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

**Penjelasan**:
- `e.preventDefault()`: Cegah reload page
- `onChange`: Update state saat user ketik
- `onSubmit`: Handle saat form disubmit

### B. **Dashboard Component** (`Dashboard.tsx`)

**Fungsi**: Tampilkan overview konsumsi listrik

**Sintaks Penting**:
```tsx
import { AreaChart, Area } from 'recharts';

function Dashboard() {
  const { realtimeData, riwayatHarian } = mockData;
  
  return (
    <div className="dashboard-container">
      {/* Card Daya */}
      <div className="dashboard-card">
        <h3>Daya Saat Ini</h3>
        <p>{realtimeData.daya} W</p>
      </div>
      
      {/* Chart */}
      <AreaChart data={riwayatHarian}>
        <Area dataKey="kwh" fill="#3b82f6" />
      </AreaChart>
    </div>
  );
}
```

**Penjelasan**:
- `AreaChart`: Komponen grafik dari Recharts
- `dataKey`: Field mana yang mau ditampilkan di chart

### C. **Context (State Management)** (`AppContext.tsx`)

**Fungsi**: Share data antar component tanpa props

**Sintaks**:
```tsx
import { createContext, useContext, useState } from 'react';

// 1. Buat Context
const AppContext = createContext();

// 2. Buat Provider
export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [devices, setDevices] = useState([]);
  
  const value = {
    currentUser,
    setUser: setCurrentUser,
    devices,
    addDevice: (device) => setDevices([...devices, device])
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// 3. Custom hook untuk akses context
export function useApp() {
  return useContext(AppContext);
}
```

**Cara Pakai**:
```tsx
// Di component manapun
function Sidebar() {
  const { currentUser, devices } = useApp();
  
  return <div>User: {currentUser.name}</div>;
}
```

### D. **Monitoring Component** (`Monitoring.tsx`)

**Fungsi**: Monitor perangkat IoT

**Fitur**:
- List semua device
- Detail per device
- Tambah/hapus device
- Lihat anomali

**Sintaks Modal**:
```tsx
function Monitoring() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  return (
    <div>
      {/* List Device */}
      {devices.map(device => (
        <div key={device.id} onClick={() => {
          setSelectedDevice(device);
          setShowModal(true);
        }}>
          {device.name}
        </div>
      ))}
      
      {/* Modal Detail */}
      {showModal && (
        <div className="modal">
          <h2>{selectedDevice.name}</h2>
          <p>Daya: {selectedDevice.watt}W</p>
          <button onClick={() => setShowModal(false)}>
            Tutup
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 5. ALUR DATA

### 📊 **Flow Diagram**

```
ESP32 + PZEM-004T
       ↓
  [Baca Sensor]
       ↓
   Data: {
     voltage: 220V,
     current: 2.21A,
     power: 486W,
     energy: 4.02kWh
   }
       ↓
[Kirim via HTTP/MQTT]
       ↓
   Backend API
   (Node.js)
       ↓
  MongoDB Database
       ↓
[WebSocket/Polling]
       ↓
  React Frontend
       ↓
  Update UI
  (Real-time)
```

### 🔄 **State Management Flow**

```
User Action
    ↓
Event Handler
    ↓
setState()
    ↓
Component Re-render
    ↓
UI Update
```

**Contoh**:
```tsx
// 1. User klik tombol
<button onClick={handleClick}>Tambah</button>

// 2. Event handler
function handleClick() {
  // 3. Update state
  setCount(count + 1);
}

// 4. Component re-render otomatis
// 5. UI update dengan nilai baru
```

---

## 6. HARDWARE IoT

### 🔌 **Koneksi Hardware**

```
PZEM-004T → ESP32
-----------------------
TX        → RX (GPIO 16)
RX        → TX (GPIO 17)
VCC       → 5V
GND       → GND
```

### 💻 **Code ESP32 (Arduino)**

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <PZEM004Tv30.h>

PZEM004Tv30 pzem(Serial2, 16, 17); // RX, TX

void setup() {
  Serial.begin(115200);
  WiFi.begin("SSID", "PASSWORD");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi Connected!");
}

void loop() {
  // Baca sensor
  float voltage = pzem.voltage();
  float current = pzem.current();
  float power = pzem.power();
  float energy = pzem.energy();
  
  // Kirim ke backend
  sendToBackend(voltage, current, power, energy);
  
  delay(5000); // Kirim tiap 5 detik
}

void sendToBackend(float v, float c, float p, float e) {
  HTTPClient http;
  http.begin("http://backend-url/api/sensor-data");
  http.addHeader("Content-Type", "application/json");
  
  String json = "{";
  json += "\"voltage\":" + String(v) + ",";
  json += "\"current\":" + String(c) + ",";
  json += "\"power\":" + String(p) + ",";
  json += "\"energy\":" + String(e);
  json += "}";
  
  int httpCode = http.POST(json);
  http.end();
}
```

---

## 7. TIPS PRESENTASI

### 📝 **Struktur Presentasi**

#### **1. Pembukaan (2 menit)**
- Perkenalan tim
- Latar belakang masalah
- Tujuan project

#### **2. Demo Aplikasi (5 menit)**
- Login
- Dashboard (tunjukkan real-time)
- Monitoring device
- Deteksi anomali
- Smart grouping

#### **3. Penjelasan Teknologi (5 menit)**

**Frontend:**
- "Kami pakai React dengan TypeScript untuk type safety"
- "CSS Variables untuk konsistensi design"
- "Recharts untuk visualisasi data"

**Backend (jika ada):**
- "Node.js dengan Express"
- "MongoDB untuk database"
- "MQTT untuk real-time communication"

**Hardware:**
- "ESP32 sebagai mikrokontroler"
- "PZEM-004T untuk baca sensor listrik"
- "WiFi untuk koneksi ke server"

#### **4. Penjelasan Kode (3 menit)**

Tunjukkan 2-3 snippet penting:

**A. State Management**
```tsx
const { currentUser, devices } = useApp();
```
"Ini context untuk share data global"

**B. Component Reusable**
```tsx
<Button text="Simpan" onClick={handleSave} />
```
"Komponen button yang bisa dipakai di mana saja"

**C. Real-time Update**
```tsx
useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, []);
```
"Auto update data setiap 5 detik"

#### **5. Arsitektur Sistem (2 menit)**

Tunjukkan diagram:
```
IoT Device → Backend → Database
                ↓
            Frontend
                ↓
              User
```

#### **6. Penutup (2 menit)**
- Kesimpulan
- Future improvement
- Q&A

### 🎤 **Script Presentasi Singkat**

**Opening:**
> "Selamat pagi/siang. Kami dari tim [nama] akan presentasikan WattWise, sistem monitoring kelistrikan berbasis IoT. Project ini bertujuan untuk membantu monitoring konsumsi listrik secara real-time."

**Demo:**
> "Mari saya demo aplikasinya. Ini dashboard yang menampilkan konsumsi daya real-time [tunjuk ke angka]. Di sini bisa lihat grafik tren konsumsi [scroll]. Kalau ada anomali, sistem otomatis kasih alert [tunjuk notif]."

**Teknologi:**
> "Untuk tech stack, kami pakai React dengan TypeScript di frontend untuk type safety. Backend pakai Node.js, database MongoDB. Hardware-nya ESP32 connect ke sensor PZEM-004T yang baca data listrik."

**Kode:**
> "Ini contoh code state management pakai Context API [tunjuk layar]. Dengan ini semua component bisa akses data user tanpa props drilling. Ini code untuk real-time update, pakai useEffect dan setInterval untuk fetch data tiap 5 detik."

**Closing:**
> "Kesimpulannya, WattWise adalah solusi IoT untuk monitoring listrik dengan dashboard web yang user-friendly. Kedepannya bisa ditambah prediksi biaya dan export report. Terima kasih. Ada pertanyaan?"

### 📊 **Slide yang Perlu Disiapkan**

1. **Cover** - Judul, logo, nama tim
2. **Latar Belakang** - Masalah yang diselesaikan
3. **Solusi** - WattWise overview
4. **Arsitektur Sistem** - Diagram lengkap
5. **Tech Stack** - Logo teknologi yang dipakai
6. **Demo Aplikasi** - Screenshot fitur utama
7. **Code Snippet** - 2-3 contoh kode penting
8. **Hardware Setup** - Foto ESP32 + sensor
9. **Future Work** - Pengembangan selanjutnya
10. **Penutup** - Thank you + Q&A

---

## 📌 CHEAT SHEET

### Quick Reference Commands

```bash
# Install dependencies
npm install

# Run development
npm start

# Build production
npm run build

# Run tests
npm test
```

### Import Statements

```tsx
// React Hooks
import { useState, useEffect, useContext } from 'react';

// Components
import Sidebar from './components/Sidebar';

// Context
import { useApp } from './context/AppContext';

// Data
import { mockData } from './data/mockData';

// CSS
import './styles/dashboard.css';
```

### Common Patterns

```tsx
// Conditional Rendering
{isLoading && <Spinner />}
{error && <Error message={error} />}
{data && <DataDisplay data={data} />}

// List Rendering
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// Event Handling
onClick={() => handleClick()}
onChange={(e) => setValue(e.target.value)}
onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
```

---

## ✅ CHECKLIST SEBELUM PRESENTASI

- [ ] Aplikasi jalan di `http://localhost:3000`
- [ ] Test semua fitur (login, dashboard, monitoring, dll)
- [ ] Siapkan data demo yang menarik
- [ ] Screenshot fitur-fitur utama
- [ ] Hapus console.log() di production
- [ ] Check responsive design (desktop & mobile)
- [ ] Siapkan backup (recording/video) jika demo gagal
- [ ] Latihan presentasi 2-3 kali
- [ ] Siapkan jawaban untuk pertanyaan umum

---

**Good Luck! 🚀**

*Dibuat: September 2026*  
*Project: WattWise IoT Energy Monitor*
