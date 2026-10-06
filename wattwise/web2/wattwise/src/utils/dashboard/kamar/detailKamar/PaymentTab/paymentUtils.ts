import { Payment } from '../../../../../context/AppContext';

export function generatePayments(tanggalMasuk: string, hargaSewa: number): Payment[] {
  if (!tanggalMasuk) return [];
  
  const payments: Payment[] = [];
  const moveInDate = new Date(tanggalMasuk);
  const today = new Date();
  const moveInDay = moveInDate.getDate();
  
  // Payment logic:
  // - Masuk 3 Oktober → Jatuh tempo pertama: 3 November (bulan berikutnya)
  // - Hanya generate 1 tagihan aktif (yang sudah atau akan jatuh tempo)
  // - Tagihan berikutnya muncul setelah tagihan sebelumnya lunas
  
  // Start from move-in month, but due date is NEXT month
  let currentMonth = new Date(moveInDate.getFullYear(), moveInDate.getMonth(), 1);
  let paymentCount = 0;
  
  while (currentMonth <= new Date(today.getFullYear(), today.getMonth(), 1)) {
    // Due date is NEXT month from the period
    const dueDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, moveInDay);
    
    // Only show payments that are already due or will be due soon
    const daysDiff = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Don't generate future payments if current payment is not paid
    if (paymentCount > 0 && daysDiff < -7) {
      // Stop generating if there's an unpaid bill and next due date is more than 7 days away
      break;
    }
    
    let status: 'lunas' | 'sudah_bayar' | 'belum_bayar' | 'terlambat' = 'belum_bayar';
    
    if (daysDiff > 7) {
      // More than 7 days overdue
      status = 'terlambat';
    } else if (daysDiff > 0) {
      // 1-7 days overdue
      status = 'terlambat';
    } else {
      // Not yet due or just became due
      status = 'belum_bayar';
    }
    
    payments.push({
      id: `payment-${currentMonth.getTime()}`,
      bulan: currentMonth.toLocaleString('id-ID', { month: 'long' }),
      tahun: currentMonth.getFullYear(),
      jumlah: hargaSewa,
      status: status,
      tanggalJatuhTempo: dueDate.toISOString().split('T')[0]
    });
    
    paymentCount++;
    
    // Move to next month
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }
  
  return payments.reverse(); // Show newest first
}
