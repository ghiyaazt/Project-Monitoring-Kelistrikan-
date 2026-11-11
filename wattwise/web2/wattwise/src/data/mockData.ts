// WattWise — IoT electricity monitoring system

export interface Device {
  id: string;
  name: string;
  watt: number;
  status: "aktif" | "normal" | "anomali" | "mati";
  icon: string;
}

export interface AnomalyEvent {
  id: string;
  time: string;
  watt: number;
  watBefore: number; // Daya sebelumnya
  change: number; // Persentase perubahan
  changeType: "spike" | "drop"; // Lonjakan atau penurunan drastis
  status: "baru" | "ditangani";
  date: string;
  description: string;
}

export interface Notification {
  id: string;
  type: "anomali" | "peringatan" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Current real-time readings from ESP32 / FC24-0041
export const realtimeData = {
  daya: 486,        // Watt
  tegangan: 220,    // Volt
  arus: 2.21,       // Ampere
  totalEnergi: 4.02, // kWh hari ini
  sensorStatus: "TERHUBUNG" as "TERHUBUNG" | "TERPUTUS",
  lastUpdate: "10:42:31",
  deviceId: "FC24-0041",
  deviceName: "ESP32",
};

// Perangkat titik listrik
export const devices: Device[] = [
  { id: "d1", name: "Lampu", watt: 92, status: "aktif", icon: "💡" },
  { id: "d2", name: "Kipas", watt: 240, status: "aktif", icon: "🌀" },
  { id: "d3", name: "Laptop", watt: 128, status: "normal", icon: "💻" },
  { id: "d4", name: "Charger HP", watt: 26, status: "anomali", icon: "🔌" },
];

// Riwayat konsumsi 7 hari (kWh per hari)
export const riwayatHarian = [
  { hari: "Sen", kwh: 3.2, tanggal: "9 Sep" },
  { hari: "Sel", kwh: 3.8, tanggal: "10 Sep" },
  { hari: "Rab", kwh: 4.1, tanggal: "11 Sep" },
  { hari: "Kam", kwh: 3.6, tanggal: "12 Sep" },
  { hari: "Jum", kwh: 4.5, tanggal: "13 Sep" },
  { hari: "Sab", kwh: 4.3, tanggal: "14 Sep" },
  { hari: "Min", kwh: 5.1, tanggal: "15 Sep" },
];

export const riwayatStats = {
  periode: "7 Hari",
  totalEnergi: 28.6,
  rataRata: 4.09,
  anomali: 7,
};

// Grafik real-time (tiap 5 menit, 12 titik terakhir)
export const realtimeChart = [
  { time: "10:00", daya: 310 },
  { time: "10:05", daya: 340 },
  { time: "10:10", daya: 290 },
  { time: "10:15", daya: 380 },
  { time: "10:20", daya: 420 },
  { time: "10:25", daya: 395 },
  { time: "10:30", daya: 450 },
  { time: "10:35", daya: 430 },
  { time: "10:40", daya: 470 },
  { time: "10:42", daya: 486 },
];

// Daftar anomali - deteksi perubahan drastis saat monitoring
export const anomaliList: AnomalyEvent[] = [
  { 
    id: "a1", 
    time: "10:42", 
    watt: 870, 
    watBefore: 420,
    change: 107, // +107%
    changeType: "spike",
    status: "baru", 
    date: "15 Sep 2026",
    description: "Lonjakan daya drastis dari 420W ke 870W (+107%)"
  },
  { 
    id: "a2", 
    time: "08:15", 
    watt: 50, 
    watBefore: 380,
    change: -87, // -87%
    changeType: "drop",
    status: "baru", 
    date: "15 Sep 2026",
    description: "Penurunan daya drastis dari 380W ke 50W (-87%)"
  },
  { 
    id: "a3", 
    time: "13:02", 
    watt: 540, 
    watBefore: 320,
    change: 69, // +69%
    changeType: "spike",
    status: "ditangani", 
    date: "14 Sep 2026",
    description: "Lonjakan daya dari 320W ke 540W (+69%)"
  },
  { 
    id: "a4", 
    time: "20:31", 
    watt: 509, 
    watBefore: 310,
    change: 64, // +64%
    changeType: "spike",
    status: "ditangani", 
    date: "14 Sep 2026",
    description: "Lonjakan daya dari 310W ke 509W (+64%)"
  },
  { 
    id: "a5", 
    time: "07:44", 
    watt: 85, 
    watBefore: 380,
    change: -78, // -78%
    changeType: "drop",
    status: "ditangani", 
    date: "13 Sep 2026",
    description: "Penurunan daya drastis dari 380W ke 85W (-78%)"
  },
  { 
    id: "a6", 
    time: "21:15", 
    watt: 620, 
    watBefore: 410,
    change: 51, // +51%
    changeType: "spike",
    status: "ditangani", 
    date: "12 Sep 2026",
    description: "Lonjakan daya dari 410W ke 620W (+51%)"
  },
  { 
    id: "a7", 
    time: "14:30", 
    watt: 145, 
    watBefore: 450,
    change: -68, // -68%
    changeType: "drop",
    status: "ditangani", 
    date: "11 Sep 2026",
    description: "Penurunan daya dari 450W ke 145W (-68%)"
  },
];

// Detail anomali terkini
export const detailAnomali = {
  status: "ANOMALI",
  daya: 870,
  dayaSebelum: 420,
  perubahan: 107, // +107%
  waktu: "10:42",
  durasi: "3 detik",
  rekomendasi: "Periksa perangkat yang baru dinyalakan atau mengalami lonjakan konsumsi daya",
  chart: [
    { time: "10:36", daya: 410 },
    { time: "10:37", daya: 420 },
    { time: "10:38", daya: 415 },
    { time: "10:39", daya: 425 },
    { time: "10:40", daya: 430 },
    { time: "10:41", daya: 420 },
    { time: "10:42", daya: 870 }, // Lonjakan drastis!
    { time: "10:43", daya: 850 },
  ],
};

// Notifikasi
export const notifications: Notification[] = [
  { id: "n1", type: "anomali", title: "Anomali terdeteksi", message: "Charger HP menggunakan 612 W", time: "10:42", read: false },
  { id: "n2", type: "peringatan", title: "Penggunaan meningkat", message: "Konsumsi listrik meningkat dibanding pola normal", time: "09:30", read: false },
  { id: "n3", type: "info", title: "Sensor terhubung", message: "ESP32 kembali terhubung ke backend", time: "09:00", read: true },
  { id: "n4", type: "anomali", title: "Anomali terdeteksi", message: "Kipas menggunakan 518 W", time: "08:15", read: true },
  { id: "n5", type: "peringatan", title: "Daya tinggi terdeteksi", message: "Total daya melebihi 500 W selama 10 menit", time: "07:55", read: true },
  { id: "n6", type: "info", title: "Laporan harian siap", message: "Laporan konsumsi 14 September tersedia", time: "Kemarin", read: true },
];

// Pengaturan pengguna
export const pengaturanData = {
  namaAplikasi: "WattWise",
  deskripsi: "Monitoring konsumsi listrik berbasis IoT",
  notifikasi: "Aktif",
  perangkatIoT: "Terhubung",
  deviceId: "ESP32 + FC24-1441",
  profil: {
    nama: "Admin",
    email: "admin@wattwise.id",
    phone: "081234567890",
  },
};

// Dashboard konsumsi per perangkat (untuk chart dashboard)
export const dashboardDevices = [
  { name: "Lampu", watt: 120, color: "#16a34a" },
  { name: "Kipas", watt: 240, color: "#2563eb" },
  { name: "Lemari", watt: 80, color: "#7c3aed" },
  { name: "Charger HP", watt: 26, color: "#f59e0b" },
];

// Week labels for charts
export const weekLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

// IoT Devices List
export interface IoTDevice {
  id: string;
  name: string;
  deviceId: string;
  status: "connected" | "disconnected" | "error";
  lastUpdate: string;
  location?: string;
  // Real-time sensor values
  daya?: number;      // Watt
  tegangan?: number;  // Volt
  arus?: number;      // Ampere
}

export const iotDevices: IoTDevice[] = [];
