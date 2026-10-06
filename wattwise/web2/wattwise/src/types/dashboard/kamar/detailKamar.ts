import { Penghuni, Payment } from '../../../context/AppContext';

export type { Penghuni, Payment };

export interface Kamar {
  id: string;
  nama: string;
  status: 'terisi' | 'kosong';
  hargaSewa: number;
  luasKamar: number;
  fasilitas: string[];
  maxPenghuni: number;
  gambar?: string[];
  gambarProfil?: number;
  penghuniList?: Penghuni[];
  payments?: Payment[];
}

export type TabType = 'detail' | 'penghuni' | 'payment' | 'wattwise';
export type WattwiseView = 'deviceList' | 'deviceDetail';
export type DetailTab = 'anomali' | 'riwayat';
