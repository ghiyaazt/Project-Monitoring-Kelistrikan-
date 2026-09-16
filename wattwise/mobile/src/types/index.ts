/**
 * TypeScript types and interfaces untuk WattWise Mobile
 */

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

export interface RealtimeData {
  daya: number;        // Watt
  tegangan: number;    // Volt
  arus: number;        // Ampere
  totalEnergi: number; // kWh
  sensorStatus: "TERHUBUNG" | "TERPUTUS";
  lastUpdate: string;
  deviceId: string;
  deviceName: string;
}

export interface SensorData {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  frequency: number;
  powerFactor: number;
  timestamp: Date;
}

export interface Tenant {
  id: string;
  nama: string;
  kamar: string;
  status: "aktif" | "nonaktif";
  tagihan: number;
  konsumsi: number;
}

export interface Payment {
  id: string;
  tenant: string;
  kamar: string;
  jumlah: number;
  tanggal: string;
  status: "lunas" | "pending" | "terlambat";
  metode: string;
}
