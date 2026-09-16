// WattWise — IoT electricity monitoring for Kos

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
  device: string;
  watt: number;
  selisihArus: number;
  status: "baru" | "ditangani";
  date: string;
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

// Daftar anomali
export const anomaliList: AnomalyEvent[] = [
  { id: "a1", time: "10:42", device: "Charger HP", watt: 870, selisihArus: -0.21, status: "baru", date: "15 Sep 2026" },
  { id: "a2", time: "08:15", device: "Kipas", watt: 50, selisihArus: -0.58, status: "baru", date: "15 Sep 2026" },
  { id: "a3", time: "13:02", device: "Lampu", watt: 540, selisihArus: -0.12, status: "ditangani", date: "14 Sep 2026" },
  { id: "a4", time: "20:31", device: "Laptop", watt: 509, selisihArus: -0.10, status: "ditangani", date: "14 Sep 2026" },
  { id: "a5", time: "07:44", device: "Kipas", watt: 380, selisihArus: -0.33, status: "ditangani", date: "13 Sep 2026" },
  { id: "a6", time: "21:15", device: "Lampu", watt: 210, selisihArus: -0.09, status: "ditangani", date: "12 Sep 2026" },
  { id: "a7", time: "14:30", device: "Charger HP", watt: 145, selisihArus: -0.15, status: "ditangani", date: "11 Sep 2026" },
];

// Detail anomali terkini
export const detailAnomali = {
  status: "ANOMALI",
  daya: 612,
  arus: 2.78,
  selisihArus: -0.21,
  device: "Charger HP",
  rekomendasi: "Periksa perangkat aktif dan kontrol penggunaannya",
  chart: [
    { time: "10:00", daya: 120 },
    { time: "10:10", daya: 180 },
    { time: "10:20", daya: 250 },
    { time: "10:25", daya: 310 },
    { time: "10:30", daya: 410 },
    { time: "10:35", daya: 520 },
    { time: "10:40", daya: 580 },
    { time: "10:42", daya: 612 },
  ],
};

// Notifikasi
export const notifications: Notification[] = [
  { id: "n1", type: "anomali", title: "Anomali terdeteksi", message: "Charger HP menggunakan 612 W", time: "10:42", read: false },
  { id: "n2", type: "peringatan", title: "Penggunaan meningkat", message: "Konsumsi kamar meningkat dibanding pola normal", time: "09:30", read: false },
  { id: "n3", type: "info", title: "Sensor terhubung", message: "ESP32 kembali terhubung ke backend", time: "09:00", read: true },
  { id: "n4", type: "anomali", title: "Anomali terdeteksi", message: "Kipas menggunakan 518 W", time: "08:15", read: true },
  { id: "n5", type: "peringatan", title: "Daya tinggi terdeteksi", message: "Total daya melebihi 500 W selama 10 menit", time: "07:55", read: true },
  { id: "n6", type: "info", title: "Laporan harian siap", message: "Laporan konsumsi 14 September tersedia", time: "Kemarin", read: true },
];

// Pengaturan pengguna
export const pengaturanData = {
  namaAplikasi: "WattWise Kos",
  deskripsi: "Monitoring konsumsi listrik berbasis IoT & Machine Learning",
  notifikasi: "Aktif",
  perangkatIoT: "Terhubung",
  deviceId: "ESP32 + FC24-1441",
  profil: {
    nama: "Salsabila",
    kamar: "Kamar 03",
    lantai: "Lantai kedua",
    email: "salsabila@wattwise.id",
    phone: "081298765432",
  },
};

// Dashboard konsumsi per perangkat (untuk chart dashboard)
export const dashboardDevices = [
  { name: "Lampu", watt: 120, color: "#16a34a" },
  { name: "Kipas", watt: 240, color: "#2563eb" },
  { name: "Lemari", watt: 80, color: "#7c3aed" },
  { name: "Charger HP", watt: 26, color: "#f59e0b" },
];
