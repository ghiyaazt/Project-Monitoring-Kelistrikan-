import { Penghuni, Payment } from '../../../../../context/AppContext';
import { Kamar } from '../../../../../types/dashboard/kamar/detailKamar';

interface UsePaymentHandlersProps {
  kamar: Kamar;
  kosId: string | null;
  kamarId: string | undefined;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  penghuni: Penghuni | null;
  updateKamarInKos: (kosId: string, kamarId: string, updates: Partial<Kamar>) => void;
  selectedPayment: Payment | null;
  setSelectedPayment: React.Dispatch<React.SetStateAction<Payment | null>>;
  setShowKonfirmasiPembayaranModal: React.Dispatch<React.SetStateAction<boolean>>;
  formPembayaran: {
    tanggalBayar: string;
    metodePembayaran: string;
    buktiPembayaran: string;
  };
}

export const usePaymentHandlers = (props: UsePaymentHandlersProps) => {
  const {
    kamar,
    kosId,
    kamarId,
    payments,
    setPayments,
    penghuni,
    updateKamarInKos,
    selectedPayment,
    setSelectedPayment,
    setShowKonfirmasiPembayaranModal,
    formPembayaran
  } = props;

  const handleKonfirmasiPembayaran = () => {
    if (!selectedPayment || !kosId || !kamarId) return;

    const updatedPayments = payments.map(p => 
      p.id === selectedPayment.id 
        ? {
            ...p,
            status: 'sudah_bayar' as const,
            tanggalBayar: formPembayaran.tanggalBayar,
            metodePembayaran: formPembayaran.metodePembayaran,
            buktiPembayaran: formPembayaran.buktiPembayaran
          }
        : p
    );

    setPayments(updatedPayments);

    updateKamarInKos(kosId, kamarId, {
      payments: updatedPayments
    });

    setShowKonfirmasiPembayaranModal(false);
    setSelectedPayment(null);
  };

  const handleVerifikasiPembayaran = (payment: Payment) => {
    if (!kosId || !kamarId || !penghuni) return;

    if (window.confirm(`Verifikasi pembayaran ${payment.bulan} ${payment.tahun}?`)) {
      const updatedPayments = payments.map(p => 
        p.id === payment.id 
          ? { ...p, status: 'lunas' as const }
          : p
      );

      const today = new Date();
      const lastPayment = updatedPayments[0];
      const lastPaymentDate = new Date(lastPayment.tahun, 
        new Date(Date.parse(lastPayment.bulan + " 1, 2000")).getMonth(), 1);
      
      const nextMonth = new Date(lastPaymentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const nextMonthExists = updatedPayments.some(p => 
        p.tahun === nextMonth.getFullYear() && 
        p.bulan === nextMonth.toLocaleString('id-ID', { month: 'long' })
      );
      
      if (!nextMonthExists && penghuni) {
        const moveInDay = new Date(penghuni.tanggalMasuk).getDate();
        const dueDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, moveInDay);
        
        const daysDiff = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        let status: 'lunas' | 'sudah_bayar' | 'belum_bayar' | 'terlambat' = 'belum_bayar';
        
        if (daysDiff > 0) {
          status = 'terlambat';
        }
        
        const newPayment: Payment = {
          id: `payment-${nextMonth.getTime()}`,
          bulan: nextMonth.toLocaleString('id-ID', { month: 'long' }),
          tahun: nextMonth.getFullYear(),
          jumlah: kamar.hargaSewa,
          status: status,
          tanggalJatuhTempo: dueDate.toISOString().split('T')[0]
        };
        
        updatedPayments.unshift(newPayment);
      }

      setPayments(updatedPayments);

      updateKamarInKos(kosId, kamarId, {
        payments: updatedPayments
      });
    }
  };

  const handleMarkAsPaid = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
      handleVerifikasiPembayaran(payment);
    }
  };

  return {
    handleKonfirmasiPembayaran,
    handleVerifikasiPembayaran,
    handleMarkAsPaid
  };
};
