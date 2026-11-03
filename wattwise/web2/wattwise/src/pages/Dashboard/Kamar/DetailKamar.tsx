import React, { useState, useEffect } from 'react';
import { useApp, Penghuni, Payment } from '../../../context/AppContext';
import { Kamar } from '../../../types/dashboard/kamar/detailKamar';
import { PenghuniTab, DetailTab, PaymentTab, WattwiseTab, InviteTenantModal, KonfirmasiPembayaranModal } from '../../../components/dashboard/kamar/detailKamar';
import { useTenantHandlers, usePaymentHandlers, useKamarEditHandlers } from '../../../hooks/dashboard/kamar/detailKamar/shared/useDetailKamarHandlers';
import { getKamarAndKos } from '../../../utils/dashboard/kamar/detailKamar';
import '../../../styles/kamar/index.css';

interface DetailKamarProps {
  kamarId?: string;
  onBack?: () => void;
}

type TabType = 'detail' | 'penghuni' | 'payment' | 'wattwise';

const DetailKamar: React.FC<DetailKamarProps> = ({ kamarId, onBack }) => {
  const { effectiveTheme, kosList, updateKamarInKos, deleteKamarFromKos } = useApp();
  const isDark = effectiveTheme === 'dark';

  // Get real kamar data from kosList and find its kos
  const kamarData = getKamarAndKos(kosList, kamarId);
  const realKamar = kamarData?.kamar || null;
  const kosId = kamarData?.kosId || '';

  // Use real data if available, otherwise use mock data
  const [kamar, setKamar] = useState<Kamar>(
    realKamar || {
      id: kamarId || 'k1',
      nama: 'Kamar 1',
      status: 'kosong',
      hargaSewa: 0,
      luasKamar: 0,
      fasilitas: [],
      maxPenghuni: 1
    }
  );

  // Only sync with context data on initial mount
  useEffect(() => {
    if (realKamar) {
      setKamar(realKamar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency - only run once on mount

  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormKamar, setEditFormKamar] = useState<Kamar>(kamar);
  const [newFasilitas, setNewFasilitas] = useState('');
  const [editKamarImages, setEditKamarImages] = useState<string[]>([]);
  const [editKamarProfileIndex, setEditKamarProfileIndex] = useState<number>(0);

  // Update edit form when kamar changes (but don't reset penghuni list)
  useEffect(() => {
    setEditFormKamar(kamar);
    setEditKamarImages(kamar.gambar || []);
    setEditKamarProfileIndex(kamar.gambarProfil || 0);
  }, [kamar]);

  // Only sync penghuni list and payments on initial mount
  useEffect(() => {
    const newPenghuniList = kamar.penghuniList || [];
    setPenghuniList(newPenghuniList);
    setPenghuni(newPenghuniList.length > 0 ? newPenghuniList[0] : null);
    setPayments(kamar.payments || []);
    if (newPenghuniList.length > 0) {
      setTanggalMasukPenghuni(newPenghuniList[0].tanggalMasuk);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency - only run once on mount

  const [penghuni, setPenghuni] = useState<Penghuni | null>(kamar.penghuniList && kamar.penghuniList.length > 0 ? kamar.penghuniList[0] : null);
  const [penghuniList, setPenghuniList] = useState<Penghuni[]>(kamar.penghuniList || []);
  const [tanggalMasukPenghuni, setTanggalMasukPenghuni] = useState<string>(kamar.penghuniList && kamar.penghuniList.length > 0 ? kamar.penghuniList[0].tanggalMasuk : '');
  const [payments, setPayments] = useState<Payment[]>(kamar.payments || []);

  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Payment modal states
  const [showKonfirmasiPembayaranModal, setShowKonfirmasiPembayaranModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [formPembayaran, setFormPembayaran] = useState({
    metodePembayaran: 'Transfer Bank',
    tanggalBayar: new Date().toISOString().split('T')[0],
    buktiPembayaran: ''
  });

  // Use custom hooks for all handlers (split into 3 categories)
  const tenantHandlers = useTenantHandlers({
    kamar,
    kosId,
    kamarId,
    payments,
    setPayments,
    penghuniList,
    setPenghuniList,
    setPenghuni,
    setTanggalMasukPenghuni,
    updateKamarInKos,
    setShowInviteModal,
    tanggalMasukPenghuni
  });

  const paymentHandlers = usePaymentHandlers({
    kosId,
    kamarId,
    kamar,
    penghuni,
    payments,
    setPayments,
    updateKamarInKos,
    selectedPayment,
    setSelectedPayment,
    setShowKonfirmasiPembayaranModal,
    formPembayaran
  });

  const kamarEditHandlers = useKamarEditHandlers({
    kamar,
    kosId,
    kamarId,
    setKamar,
    editFormKamar,
    setEditFormKamar,
    editKamarImages,
    setEditKamarImages,
    editKamarProfileIndex,
    setEditKamarProfileIndex,
    setIsEditMode,
    newFasilitas,
    setNewFasilitas,
    updateKamarInKos,
    deleteKamarFromKos,
    onBack
  });

  // Combine all handlers for easier passing to components
  const handlers = {
    ...tenantHandlers,
    ...paymentHandlers,
    ...kamarEditHandlers
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="flex flex-col min-h-screen">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header dengan Title dan Tombol Back */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => onBack && onBack()}
              className={`${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {kamar.nama}
              </h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'} mt-1`}>
                Status: <span className={`font-medium ${kamar.status === 'terisi' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-slate-400'}`}>
                  {kamar.status === 'terisi' ? 'Terisi' : 'Kosong'}
                </span>
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex gap-6 border-b border-gray-200 dark:border-slate-700">
              {(['detail', 'penghuni', 'payment', 'wattwise'] as TabType[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                      : `border-transparent ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-900'}`
                  }`}
                >
                  {tab === 'detail' && 'Detail Kamar'}
                  {tab === 'penghuni' && 'Penghuni'}
                  {tab === 'payment' && 'Pembayaran'}
                  {tab === 'wattwise' && 'WattWise'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'detail' && (
            <DetailTab
              isDark={isDark}
              kamar={kamar}
              isEditMode={isEditMode}
              editFormKamar={editFormKamar}
              setEditFormKamar={setEditFormKamar}
              newFasilitas={newFasilitas}
              setNewFasilitas={setNewFasilitas}
              editKamarImages={editKamarImages}
              editKamarProfileIndex={editKamarProfileIndex}
              handleStartEdit={handlers.handleStartEdit}
              handleSaveEdit={handlers.handleSaveEdit}
              handleCancelEdit={handlers.handleCancelEdit}
              handleDeleteKamar={handlers.handleDeleteKamar}
              handleAddFasilitas={handlers.handleAddFasilitas}
              handleRemoveFasilitas={handlers.handleRemoveFasilitas}
              handleEditKamarImageUpload={handlers.handleEditKamarImageUpload}
              handleRemoveEditKamarImage={handlers.handleRemoveEditKamarImage}
              handleSetEditKamarProfileImage={handlers.handleSetEditKamarProfileImage}
            />
          )}

          {/* Tab: Penghuni */}
          {activeTab === 'penghuni' && (
            <PenghuniTab
              isDark={isDark}
              penghuniList={penghuniList}
              maxPenghuni={kamar.maxPenghuni}
              onAddPenghuni={() => setShowInviteModal(true)}
              onRemovePenghuni={handlers.handleRemoveTenant}
            />
          )}

          {/* Tab: Payment */}
          {activeTab === 'payment' && (
            <PaymentTab
              isDark={isDark}
              penghuni={penghuni}
              payments={payments}
              handleMarkAsPaid={handlers.handleMarkAsPaid}
            />
          )}

          {/* Tab: WattWise */}
          {activeTab === 'wattwise' && (
            <WattwiseTab
              isDark={isDark}
              kamarId={kamarId || ''}
            />
          )}
        </main>
      </div>

      {/* Modal Undang Penghuni */}
      <InviteTenantModal
        show={showInviteModal}
        isDark={isDark}
        searchEmail={handlers.searchEmail}
        searchResults={handlers.searchResults}
        selectedUser={handlers.selectedUser}
        isSearching={handlers.isSearching}
        tanggalMasukPenghuni={tanggalMasukPenghuni}
        onClose={() => {
          setShowInviteModal(false);
          setTanggalMasukPenghuni('');
        }}
        onSearchEmail={handlers.handleSearchEmail}
        onSelectUser={handlers.handleSelectUser}
        onInvite={handlers.handleInviteTenant}
        onTanggalChange={setTanggalMasukPenghuni}
      />

      {/* Modal Konfirmasi Pembayaran */}
      <KonfirmasiPembayaranModal
        show={showKonfirmasiPembayaranModal}
        isDark={isDark}
        selectedPayment={selectedPayment}
        formPembayaran={formPembayaran}
        onClose={() => setShowKonfirmasiPembayaranModal(false)}
        onFormChange={setFormPembayaran}
        onKonfirmasi={handlers.handleKonfirmasiPembayaran}
      />
    </div>
  );
};

export default DetailKamar;
