export type Gender = 'Laki-laki' | 'Perempuan';

export interface User {
  email: string;
  password: string;
  phone: string;
  gender?: Gender;
  ktpUri?: string;
  name: string;
  role: 'penghuni'; // di mobile role selalu penghuni
}

export interface RegisterData {
  email: string;
  password: string;
  phone: string;
  gender?: Gender;
  ktpUri: string;
}

export interface Kost {
  id: string;
  name: string;
  address: string;
  type: 'Putra' | 'Putri' | 'Campur';
  ownerName: string;
  ownerPhone: string;
  priceFrom: number;
  totalRooms: number;
  availableRooms: number;
  facilities: string[];
}

export interface Room {
  id: string;
  kostId: string;
  name: string;
  floor: number;
  size: string;
  price: number; // sewa per bulan
  facilities: string[];
  deviceId?: string; // sensor ESP32
  since: string; // mulai dihuni
  electricBase: number; // dasar tagihan listrik (dummy)
}

export interface Occupant {
  id: string;
  name: string;
  phone: string;
  since: string;
  email?: string;
}

export type BillStatus = 'lunas' | 'belum';

export interface Bill {
  id: string;
  period: string;
  dueDate: string;
  rent: number;
  electricity: number;
  status: BillStatus;
  paidAt?: string;
}

export interface Anomaly {
  id: string;
  device: string;
  watt: number;
  date: string;
  time: string;
  delta: number;
  baru: boolean;
}

export const DEMO_USER: User = {
  email: 'salsabila@wattwise.id',
  password: 'kamar03',
  phone: '081234567890',
  ktpUri: 'demo',
  name: 'Salsabila',
  role: 'penghuni',
};

// Semua kost yang terdaftar di website
export const allKost: Kost[] = [
  {
    id: 'k1',
    name: 'Kos WattWise',
    address: 'Jl. Mastrip No. 12, Jember',
    type: 'Putra',
    ownerName: 'Pak Hendra',
    ownerPhone: '081234500001',
    priceFrom: 700000,
    totalRooms: 12,
    availableRooms: 3,
    facilities: ['Wi-Fi', 'Parkir motor', 'Dapur bersama', 'CCTV'],
  },
  {
    id: 'k2',
    name: 'Kos Melati',
    address: 'Jl. Kalimantan No. 7, Jember',
    type: 'Putri',
    ownerName: 'Bu Sari',
    ownerPhone: '081234500002',
    priceFrom: 650000,
    totalRooms: 8,
    availableRooms: 3,
    facilities: ['Wi-Fi', 'Laundry', 'Dapur bersama'],
  },
  {
    id: 'k3',
    name: 'Kos Griya Asri',
    address: 'Jl. Jawa No. 21, Jember',
    type: 'Putri',
    ownerName: 'Bu Ratna',
    ownerPhone: '081234500003',
    priceFrom: 650000,
    totalRooms: 10,
    availableRooms: 2,
    facilities: ['Wi-Fi', 'Parkir motor', 'Kamar mandi dalam', 'CCTV'],
  },
  {
    id: 'k4',
    name: 'Kos Sejahtera',
    address: 'Jl. Sumatra No. 5, Jember',
    type: 'Campur',
    ownerName: 'Pak Budi',
    ownerPhone: '081234500004',
    priceFrom: 750000,
    totalRooms: 15,
    availableRooms: 5,
    facilities: ['Wi-Fi', 'AC', 'Parkir mobil', 'Dapur bersama'],
  },
  {
    id: 'k5',
    name: 'Kos Anggrek',
    address: 'Jl. Karimata No. 30, Jember',
    type: 'Putra',
    ownerName: 'Pak Joko',
    ownerPhone: '081234500005',
    priceFrom: 600000,
    totalRooms: 9,
    availableRooms: 0,
    facilities: ['Wi-Fi', 'Parkir motor'],
  },
];

export const allRooms: Room[] = [
  {
    id: 'r1',
    kostId: 'k3',
    name: 'Kamar 03',
    floor: 1,
    size: '3 x 4 m',
    price: 750000,
    facilities: ['Kasur', 'Lemari', 'Kamar mandi dalam', 'AC', 'Wi-Fi'],
    deviceId: 'FC24-0112',
    since: 'Agustus 2025',
    electricBase: 142500,
  },
  {
    id: 'r2',
    kostId: 'k3',
    name: 'Kamar 04',
    floor: 1,
    size: '3 x 3 m',
    price: 650000,
    facilities: ['Kasur', 'Lemari', 'Kipas angin', 'Wi-Fi'],
    deviceId: 'FC24-0113',
    since: 'Januari 2026',
    electricBase: 98000,
  },
  {
    id: 'r3',
    kostId: 'k4',
    name: 'Kamar 11',
    floor: 2,
    size: '3 x 4 m',
    price: 800000,
    facilities: ['Kasur', 'Lemari', 'AC', 'Wi-Fi'],
    since: 'Maret 2026',
    electricBase: 120000,
  },
];

export const occupantsByRoom: Record<string, Occupant[]> = {
  r1: [
    {
      id: 'o1',
      name: 'Salsabila',
      phone: '081234567890',
      since: 'Agustus 2025',
      email: DEMO_USER.email,
    },
    {
      id: 'o2',
      name: 'Ayu Lestari',
      phone: '081355500011',
      since: 'Agustus 2025',
    },
  ],
  r2: [
    {
      id: 'o3',
      name: 'Salsabila',
      phone: '081234567890',
      since: 'Januari 2026',
      email: DEMO_USER.email,
    },
  ],
  r3: [
    {
      id: 'o4',
      name: 'Salsabila',
      phone: '081234567890',
      since: 'Maret 2026',
      email: DEMO_USER.email,
    },
    {
      id: 'o5',
      name: 'Rina Putri',
      phone: '081355500012',
      since: 'Maret 2026',
    },
    {
      id: 'o6',
      name: 'Dewi Anggraini',
      phone: '081355500013',
      since: 'April 2026',
    },
  ],
};

export const kostById = (id: string) => allKost.find(k => k.id === id);
export const roomById = (id: string) => allRooms.find(r => r.id === id);

// Kamar yang dihuni user. Akun baru (hasil register) belum punya kamar.
export const myRoomIdsFor = (email: string): string[] =>
  email === DEMO_USER.email ? ['r1', 'r2', 'r3'] : [];

export function billsForRoom(room: Room): Bill[] {
  const periods: { period: string; dueDate: string; paidAt?: string }[] = [
    { period: 'Oktober 2026', dueDate: '20 Okt 2026' },
    { period: 'September 2026', dueDate: '20 Sep 2026', paidAt: '18 Sep 2026' },
    { period: 'Agustus 2026', dueDate: '20 Agu 2026', paidAt: '19 Agu 2026' },
    { period: 'Juli 2026', dueDate: '20 Jul 2026', paidAt: '20 Jul 2026' },
  ];
  return periods.map((p, i) => ({
    id: `${room.id}-b${i}`,
    period: p.period,
    dueDate: p.dueDate,
    rent: room.price,
    electricity: room.electricBase + i * 7500,
    status: (p.paidAt ? 'lunas' : 'belum') as BillStatus,
    paidAt: p.paidAt,
  }));
}

// ---- Data monitoring listrik (dummy) ----
export const initialPowerSeries = [
  430, 445, 425, 470, 480, 470, 495, 490, 482, 486,
];

export const devices = [
  { id: 'd1', name: 'Lampu', watt: 120, color: '#16A34A' },
  { id: 'd2', name: 'Kipas', watt: 240, color: '#2563EB' },
  { id: 'd3', name: 'Lemari', watt: 80, color: '#7C3AED' },
  { id: 'd4', name: 'Charger HP', watt: 26, color: '#F59E0B' },
];

export const anomalies: Anomaly[] = [
  {
    id: 'a1',
    device: 'Charger HP',
    watt: 612,
    date: '15 Sep 2026',
    time: '10:42',
    delta: -0.21,
    baru: true,
  },
  {
    id: 'a2',
    device: 'Kipas',
    watt: 50,
    date: '15 Sep 2026',
    time: '08:15',
    delta: -0.58,
    baru: true,
  },
  {
    id: 'a3',
    device: 'Lampu',
    watt: 540,
    date: '14 Sep 2026',
    time: '13:02',
    delta: -0.12,
    baru: false,
  },
  {
    id: 'a4',
    device: 'Laptop',
    watt: 509,
    date: '14 Sep 2026',
    time: '20:31',
    delta: -0.1,
    baru: false,
  },
  {
    id: 'a5',
    device: 'Kipas',
    watt: 380,
    date: '13 Sep 2026',
    time: '07:44',
    delta: -0.33,
    baru: false,
  },
];
