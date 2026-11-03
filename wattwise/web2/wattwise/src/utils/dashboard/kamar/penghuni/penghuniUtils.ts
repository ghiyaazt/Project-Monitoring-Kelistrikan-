/**
 * Payment status type for penghuni
 */
export type PaymentStatus = 'lunas' | 'sudah_bayar' | 'belum_bayar' | 'terlambat';

/**
 * Get CSS class for payment status badge
 * @param status - Payment status
 * @returns CSS class name
 */
export const getStatusBadgeClass = (status: PaymentStatus): string => {
  switch (status) {
    case 'lunas':
      return 'kamar-status-success';
    case 'sudah_bayar':
      return 'kamar-status-info';
    case 'belum_bayar':
      return 'kamar-status-warning';
    case 'terlambat':
      return 'kamar-status-error';
    default:
      return 'kamar-status-neutral';
  }
};

/**
 * Get display text for payment status
 * @param status - Payment status
 * @returns Human-readable status text
 */
export const getStatusText = (status: PaymentStatus): string => {
  switch (status) {
    case 'lunas':
      return 'Lunas';
    case 'sudah_bayar':
      return 'Sudah Bayar';
    case 'belum_bayar':
      return 'Belum Bayar';
    case 'terlambat':
      return 'Terlambat';
    default:
      return status;
  }
};
