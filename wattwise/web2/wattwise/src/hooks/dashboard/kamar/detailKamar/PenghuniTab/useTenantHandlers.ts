import { useState } from 'react';
import { Penghuni, Payment } from '../../../../../context/AppContext';
import { Kamar } from '../../../../../types/dashboard/kamar/detailKamar';
import { mockUsers, User } from '../../../../../utils/dashboard/kamar/detailKamar/PenghuniTab/mockUsers';
import { generatePayments } from '../../../../../utils/dashboard/kamar/detailKamar/PaymentTab/paymentUtils';

interface UseTenantHandlersProps {
  kamar: Kamar;
  kosId: string | null;
  kamarId: string | undefined;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  penghuniList: Penghuni[];
  setPenghuniList: React.Dispatch<React.SetStateAction<Penghuni[]>>;
  setPenghuni: React.Dispatch<React.SetStateAction<Penghuni | null>>;
  setTanggalMasukPenghuni: React.Dispatch<React.SetStateAction<string>>;
  updateKamarInKos: (kosId: string, kamarId: string, updates: Partial<Kamar>) => void;
  setShowInviteModal: React.Dispatch<React.SetStateAction<boolean>>;
  tanggalMasukPenghuni: string;
}

export const useTenantHandlers = (props: UseTenantHandlersProps) => {
  const {
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
  } = props;

  // Local state for search
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchEmail = (email: string) => {
    setSearchEmail(email);
    setSelectedUser(null);
    
    if (email.length >= 3) {
      setIsSearching(true);
      setSearchResults([]);
      
      setTimeout(() => {
        const results = mockUsers.filter(user => 
          user.email.toLowerCase().includes(email.toLowerCase()) ||
          user.nama.toLowerCase().includes(email.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchEmail(user.email);
    setSearchResults([]);
  };

  const handleInviteTenant = () => {
    if (selectedUser && tanggalMasukPenghuni && kosId && kamarId) {
      const newPenghuni: Penghuni = {
        id: `p${Date.now()}`,
        nama: selectedUser.nama,
        email: selectedUser.email,
        telepon: '-',
        tanggalMasuk: tanggalMasukPenghuni
      };
      
      const updatedPenghuniList = [...penghuniList, newPenghuni];
      
      let generatedPayments = payments;
      if (updatedPenghuniList.length === 1) {
        generatedPayments = generatePayments(tanggalMasukPenghuni, kamar.hargaSewa);
      }
      
      setPenghuniList(updatedPenghuniList);
      setPenghuni(updatedPenghuniList[0]);
      setPayments(generatedPayments);
      
      const newStatus = updatedPenghuniList.length >= kamar.maxPenghuni ? 'terisi' : 'kosong';
      
      updateKamarInKos(kosId, kamarId, {
        status: newStatus,
        penghuniList: updatedPenghuniList,
        payments: generatedPayments
      });
      
      setShowInviteModal(false);
      setSearchEmail('');
      setSelectedUser(null);
      setTanggalMasukPenghuni('');
    }
  };

  const handleRemoveTenant = (penghuniId: string) => {
    if (window.confirm('Apakah Anda yakin ingin mengeluarkan penghuni ini?') && kosId && kamarId) {
      const updatedPenghuniList = penghuniList.filter(p => p.id !== penghuniId);
      
      setPenghuniList(updatedPenghuniList);
      setPenghuni(updatedPenghuniList.length > 0 ? updatedPenghuniList[0] : null);
      
      const updatedPayments = updatedPenghuniList.length === 0 ? [] : payments;
      setPayments(updatedPayments);
      setTanggalMasukPenghuni(updatedPenghuniList.length > 0 ? updatedPenghuniList[0].tanggalMasuk : '');
      
      const newStatus = updatedPenghuniList.length === 0 ? 'kosong' : 'terisi';
      
      updateKamarInKos(kosId, kamarId, {
        status: newStatus,
        penghuniList: updatedPenghuniList,
        payments: updatedPayments
      });
    }
  };

  return {
    searchEmail,
    selectedUser,
    searchResults,
    isSearching,
    handleSearchEmail,
    handleSelectUser,
    handleInviteTenant,
    handleRemoveTenant
  };
};
