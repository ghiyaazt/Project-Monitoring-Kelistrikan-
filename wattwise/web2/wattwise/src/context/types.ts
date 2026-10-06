import { IoTDevice } from '../data/mockData';

export interface User {
  name: string;
  email: string;
  deviceId: string;
}

export interface Penghuni {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  tanggalMasuk: string;
}

export interface Payment {
  id: string;
  bulan: string;
  tahun: number;
  jumlah: number;
  status: 'lunas' | 'sudah_bayar' | 'belum_bayar' | 'terlambat';
  tanggalBayar?: string;
  metodePembayaran?: string;
  tanggalJatuhTempo?: string;
  buktiPembayaran?: string;
}

export interface Kamar {
  id: string;
  nama: string;
  status: 'terisi' | 'kosong';
  penghuniList?: Penghuni[];
  hargaSewa: number;
  luasKamar: number;
  fasilitas: string[];
  maxPenghuni: number;
  gambar?: string[];
  gambarProfil?: number;
  payments?: Payment[];
}

export interface Kos {
  id: string;
  nama: string;
  alamat: string;
  jumlahKamar: number;
  kamarTerisi: number;
  hargaMin: number;
  hargaMax: number;
  fasilitas: string[];
  kamarList: Kamar[];
  gambar?: string[];
  gambarProfil?: number;
}

export interface SmartWattWiseGroup {
  id: string;
  name: string;
  devices: string[];
  totalDaya: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Perangkat {
  id: string;
  kamarId: string;
  nama: string;
  deviceId: string;
  dayaWatt: number;
}

export interface AppContextType {
  // User
  currentUser: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  
  // IoT Devices
  iotDevices: IoTDevice[];
  addDevice: (device: IoTDevice) => void;
  removeDevice: (deviceId: string) => void;
  updateDevice: (deviceId: string, updates: Partial<IoTDevice>) => void;
  
  // Groups
  groups: SmartWattWiseGroup[];
  addGroup: (group: Omit<SmartWattWiseGroup, 'id' | 'totalDaya'>) => void;
  removeGroup: (groupId: string) => void;
  updateGroup: (groupId: string, updates: Partial<SmartWattWiseGroup>) => void;
  
  // Kos
  kosList: Kos[];
  addKos: (kos: Omit<Kos, 'id' | 'jumlahKamar' | 'kamarTerisi' | 'kamarList'>) => void;
  removeKos: (kosId: string) => void;
  updateKos: (kosId: string, updates: Partial<Kos>) => void;
  addKamarToKos: (kosId: string, kamar: Omit<Kamar, 'id'>) => void;
  updateKamarInKos: (kosId: string, kamarId: string, updates: Partial<Kamar>) => void;
  deleteKamarFromKos: (kosId: string, kamarId: string) => void;
  
  // Perangkat
  perangkatList: Perangkat[];
  addPerangkat: (perangkat: Omit<Perangkat, 'id'>) => void;
  removePerangkat: (id: string) => void;
  
  // Theme
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  effectiveTheme: 'light' | 'dark';
  
  // Utilities
  clearAllData: () => void;
}
