import React from 'react';
import { Payment } from '../../../../../context/AppContext';

interface KonfirmasiPembayaranModalProps {
  show: boolean;
  isDark: boolean;
  selectedPayment: Payment | null;
  formPembayaran: {
    metodePembayaran: string;
    tanggalBayar: string;
    buktiPembayaran: string;
  };
  onClose: () => void;
  onFormChange: (form: { metodePembayaran: string; tanggalBayar: string; buktiPembayaran: string }) => void;
  onKonfirmasi: () => void;
}

const KonfirmasiPembayaranModal: React.FC<KonfirmasiPembayaranModalProps> = ({
  show,
  isDark,
  selectedPayment,
  formPembayaran,
  onClose,
  onFormChange,
  onKonfirmasi
}) => {
  if (!show || !selectedPayment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full`}>
        <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'} border-b px-6 py-4 flex items-center justify-between`}>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Konfirmasi Pembayaran
          </h3>
          <button
            onClick={onClose}
            className={`${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700'} text-2xl leading-none`}
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>
              Periode
            </p>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedPayment.bulan} {selectedPayment.tahun}
            </p>
          </div>

          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>
              Jumlah
            </p>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Rp {selectedPayment.jumlah.toLocaleString('id-ID')}
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
              Metode Pembayaran <span className="text-red-500">*</span>
            </label>
            <select
              value={formPembayaran.metodePembayaran}
              onChange={(e) => onFormChange({ ...formPembayaran, metodePembayaran: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg text-sm ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="Transfer Bank">Transfer Bank</option>
              <option value="Cash">Cash</option>
              <option value="E-Wallet">E-Wallet</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
              Tanggal Pembayaran <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formPembayaran.tanggalBayar}
              onChange={(e) => onFormChange({ ...formPembayaran, tanggalBayar: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg text-sm ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className={`${isDark ? 'bg-blue-900 bg-opacity-20 border-blue-800' : 'bg-blue-50 border-blue-200'} border rounded-lg p-3`}>
            <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              💡 Setelah konfirmasi, status akan berubah menjadi "Sudah Bayar" dan menunggu verifikasi dari pemilik kos.
            </p>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'} border-t px-6 py-4 flex justify-end gap-3`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded-lg text-sm font-medium transition-colors`}
          >
            Batal
          </button>
          <button
            onClick={onKonfirmasi}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Konfirmasi Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default KonfirmasiPembayaranModal;
