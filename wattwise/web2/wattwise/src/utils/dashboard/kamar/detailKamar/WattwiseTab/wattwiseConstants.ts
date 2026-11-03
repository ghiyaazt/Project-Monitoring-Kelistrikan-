/**
 * WattwiseTab Constants
 * Configuration and constant data for WattwiseTab component
 */

// Warna untuk setiap perangkat dalam chart
export const DEVICE_COLORS = [
  '#10b981', // hijau
  '#3b82f6', // biru
  '#f59e0b', // kuning
  '#ef4444', // merah
  '#8b5cf6', // ungu
  '#ec4899', // pink
  '#06b6d4', // cyan
];

// Mock data mingguan untuk testing/demo
export const WEEKLY_MOCK_DATA = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(hari => ({
  hari,
  kwh: +(4 + Math.random() * 6).toFixed(2),
}));
