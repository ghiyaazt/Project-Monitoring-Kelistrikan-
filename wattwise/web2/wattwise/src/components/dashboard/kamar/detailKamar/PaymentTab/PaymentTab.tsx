import React from 'react';
import { Payment, Penghuni } from '../../../../../context/AppContext';

interface PaymentTabProps {
  isDark: boolean;
  penghuni: Penghuni | null;
  payments: Payment[];
  handleMarkAsPaid: (paymentId: string) => void;
}

const PaymentTab: React.FC<PaymentTabProps> = ({ isDark, penghuni, payments, handleMarkAsPaid }) => {
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'lunas':
      case 'sudah_bayar':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'terlambat':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'belum_bayar':
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'lunas':
        return 'Lunas';
      case 'sudah_bayar':
        return 'Sudah Bayar';
      case 'terlambat':
        return 'Terlambat';
      case 'belum_bayar':
      default:
        return 'Belum Bayar';
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Card - How Payment Works */}
      {penghuni && payments.length > 0 && (
        <div className={`${isDark ? 'bg-gradient-to-br from-teal-900/30 to-cyan-900/30 border-teal-700' : 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200'} rounded-lg border p-6`}>
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${isDark ? 'bg-teal-600' : 'bg-teal-500'} flex items-center justify-center`}>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Pembayaran Otomatis Aktif
              </h3>
              <p className={`text-sm mb-3 ${isDark ? 'text-teal-200' : 'text-teal-900'}`}>
                Sistem pembayaran otomatis telah digenerate berdasarkan tanggal masuk penghuni: <strong>{penghuni && new Date(penghuni.tanggalMasuk).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </p>
              <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-teal-300' : 'text-teal-800'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Tanggal jatuh tempo: Setiap tanggal <strong>{new Date(penghuni.tanggalMasuk).getDate()}</strong> per bulan
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border overflow-hidden`}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Riwayat Pembayaran
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Periode
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Jumlah
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Jatuh Tempo
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Tanggal Bayar
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Metode
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-4xl mb-2">💰</div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {penghuni ? 'Pembayaran akan otomatis digenerate setelah penghuni masuk kos' : 'Belum ada penghuni'}
                    </p>
                  </td>
                </tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment.id} className={`${isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {payment.bulan} {payment.tahun}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Rp {payment.jumlah.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(payment.status)}`}>
                        {getPaymentStatusText(payment.status)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {payment.tanggalJatuhTempo ? new Date(payment.tanggalJatuhTempo).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {payment.tanggalBayar ? new Date(payment.tanggalBayar).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {payment.metodePembayaran || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.status === 'belum_bayar' || payment.status === 'terlambat' ? (
                        <button
                          onClick={() => handleMarkAsPaid(payment.id)}
                          className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-medium"
                        >
                          Tandai Lunas
                        </button>
                      ) : (
                        <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentTab;
