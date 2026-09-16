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
    nama: "Admin",
    kamar: "Monitoring Center",
    lantai: "Pusat kontrol",
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

// Room/kamar data
export interface Tenant {
  name: string;
  email?: string;
  phone?: string;
  occupation?: string;
  checkIn?: string;
  nik?: string;
}

export interface Room {
  id: string;
  number: string;
  tenant: Tenant | null;
  floor: number;
  type: string;
  price: number;
  status: "occupied" | "vacant" | "maintenance";
  usage: number;
  electricUsage: number;
  budget: number;
  electricBudget: number;
  anomaly: boolean;
  anomalyNote?: string;
}

export const rooms: Room[] = [
  { id: "r1", number: "01", tenant: { name: "Ahmad", email: "ahmad@example.com", phone: "081234567890", occupation: "Mahasiswa", checkIn: "1 Jan 2026", nik: "3201012001010001" }, floor: 1, type: "Standard", price: 800000, status: "occupied", usage: 32.5, electricUsage: 32.5, budget: 40, electricBudget: 40, anomaly: false },
  { id: "r2", number: "02", tenant: { name: "Budi", email: "budi@example.com", phone: "081234567891", occupation: "Karyawan", checkIn: "15 Feb 2026", nik: "3201012002020002" }, floor: 1, type: "Standard", price: 800000, status: "occupied", usage: 28.3, electricUsage: 28.3, budget: 40, electricBudget: 40, anomaly: false },
  { id: "r3", number: "03", tenant: { name: "Salsabila", email: "salsabila@wattwise.id", phone: "081298765432", occupation: "Mahasiswi", checkIn: "1 Mar 2026", nik: "3201012003030003" }, floor: 2, type: "Standard", price: 800000, status: "occupied", usage: 45.2, electricUsage: 45.2, budget: 40, electricBudget: 40, anomaly: true, anomalyNote: "Konsumsi listrik melebihi batas normal" },
  { id: "r4", number: "04", tenant: null, floor: 2, type: "Standard", price: 800000, status: "vacant", usage: 0, electricUsage: 0, budget: 40, electricBudget: 40, anomaly: false },
  { id: "r5", number: "05", tenant: { name: "Dewi", email: "dewi@example.com", phone: "081234567893", occupation: "Mahasiswi", checkIn: "10 Apr 2026", nik: "3201012004040004" }, floor: 2, type: "Deluxe", price: 1000000, status: "occupied", usage: 38.9, electricUsage: 38.9, budget: 40, electricBudget: 40, anomaly: false },
  { id: "r6", number: "06", tenant: { name: "Eko", email: "eko@example.com", phone: "081234567894", occupation: "Freelancer", checkIn: "5 Mei 2026", nik: "3201012005050005" }, floor: 3, type: "Standard", price: 800000, status: "occupied", usage: 35.1, electricUsage: 35.1, budget: 40, electricBudget: 40, anomaly: false },
  { id: "r7", number: "07", tenant: { name: "Fitri", email: "fitri@example.com", phone: "081234567895", occupation: "Karyawan", checkIn: "20 Jun 2026", nik: "3201012006060006" }, floor: 3, type: "Deluxe", price: 1000000, status: "occupied", usage: 41.8, electricUsage: 41.8, budget: 40, electricBudget: 40, anomaly: true, anomalyNote: "Pola penggunaan tidak biasa terdeteksi" },
  { id: "r8", number: "08", tenant: null, floor: 3, type: "Standard", price: 800000, status: "maintenance", usage: 0, electricUsage: 0, budget: 40, electricBudget: 40, anomaly: false },
];

// Week labels for charts
export const weekLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

// Electric history per room (7 days)
export const electricHistory: Record<string, number[]> = {
  r1: [4.2, 4.5, 4.8, 4.3, 4.6, 5.1, 4.9],
  r2: [3.8, 3.9, 4.1, 3.7, 4.2, 4.0, 4.3],
  r3: [5.8, 6.2, 6.5, 6.3, 6.8, 7.2, 6.4],
  r4: [0, 0, 0, 0, 0, 0, 0],
  r5: [5.2, 5.5, 5.7, 5.4, 5.8, 5.9, 5.4],
  r6: [4.8, 5.0, 5.2, 4.9, 5.3, 5.1, 4.9],
  r7: [5.9, 6.1, 6.3, 6.0, 6.4, 6.2, 5.9],
  r8: [0, 0, 0, 0, 0, 0, 0],
};

// Payment data
export interface Payment {
  id: string;
  room: string;
  roomNumber: string;
  tenant: string;
  tenantName: string;
  amount: number;
  month: string;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
  paidAt?: string;
  method?: string;
  note?: string;
}

export const payments: Payment[] = [
  { id: "p1", room: "01", roomNumber: "01", tenant: "Ahmad", tenantName: "Ahmad", amount: 800000, month: "September 2026", status: "paid", paidDate: "1 Sep", paidAt: "1 Sep", method: "Transfer Bank" },
  { id: "p2", room: "02", roomNumber: "02", tenant: "Budi", tenantName: "Budi", amount: 800000, month: "September 2026", status: "paid", paidDate: "2 Sep", paidAt: "2 Sep", method: "QRIS" },
  { id: "p3", room: "03", roomNumber: "03", tenant: "Salsabila", tenantName: "Salsabila", amount: 800000, month: "September 2026", status: "pending" },
  { id: "p4", room: "05", roomNumber: "05", tenant: "Dewi", tenantName: "Dewi", amount: 800000, month: "September 2026", status: "paid", paidDate: "3 Sep", paidAt: "3 Sep", method: "Transfer Bank" },
  { id: "p5", room: "06", roomNumber: "06", tenant: "Eko", tenantName: "Eko", amount: 800000, month: "September 2026", status: "overdue" },
  { id: "p6", room: "07", roomNumber: "07", tenant: "Fitri", tenantName: "Fitri", amount: 800000, month: "September 2026", status: "pending" },
  { id: "p7", room: "01", roomNumber: "01", tenant: "Ahmad", tenantName: "Ahmad", amount: 800000, month: "Agustus 2026", status: "paid", paidDate: "1 Agu", paidAt: "1 Agu", method: "Transfer Bank" },
  { id: "p8", room: "02", roomNumber: "02", tenant: "Budi", tenantName: "Budi", amount: 800000, month: "Agustus 2026", status: "paid", paidDate: "2 Agu", paidAt: "2 Agu", method: "Cash" },
  { id: "p9", room: "03", roomNumber: "03", tenant: "Salsabila", tenantName: "Salsabila", amount: 800000, month: "Agustus 2026", status: "paid", paidDate: "5 Agu", paidAt: "5 Agu", method: "QRIS" },
];

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
