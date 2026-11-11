import { useState } from 'react';

interface Kos {
  id: string;
  nama: string;
  alamat: string;
  jumlahKamar: number;
  kamarTerisi: number;
  hargaMin: number;
  hargaMax: number;
  fasilitas: string[];
  kamarList: any[];
  gambar?: string[];
  gambarProfil?: number;
}

interface UseKamarListHandlersProps {
  addKamarToKos: (kosId: string, kamar: any) => void;
  updateKos: (kosId: string, updates: Partial<Kos>) => void;
  removeKos: (kosId: string) => void;
  onBack?: () => void;
}

export const useKamarListHandlers = ({
  addKamarToKos,
  updateKos,
  removeKos,
  onBack
}: UseKamarListHandlersProps) => {
  // Modal states
  const [showTambahKamarModal, setShowTambahKamarModal] = useState(false);
  const [showPengaturanKosModal, setShowPengaturanKosModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedKosForKamar, setSelectedKosForKamar] = useState<Kos | null>(null);

  // Form states
  const [editFormKos, setEditFormKos] = useState({
    nama: '',
    alamat: '',
    gambar: [] as string[]
  });
  const [editPreviewImages, setEditPreviewImages] = useState<string[]>([]);
  const [editProfileImageIndex, setEditProfileImageIndex] = useState(0);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [formKamar, setFormKamar] = useState({
    nama: '',
    jumlahKamar: 1,
    hargaSewa: 0,
    luasKamar: 0,
    fasilitas: [] as string[],
    gambar: [] as string[]
  });
  const [kamarPreviewImages, setKamarPreviewImages] = useState<string[]>([]);
  const [kamarProfileImageIndex, setKamarProfileImageIndex] = useState(0);
  const [newFasilitas, setNewFasilitas] = useState('');

  // Open modals
  const handleOpenTambahKamar = (kos: Kos) => {
    setSelectedKosForKamar(kos);
    setShowTambahKamarModal(true);
  };

  const handleOpenPengaturanKos = (kos: Kos) => {
    setSelectedKosForKamar(kos);
    setEditFormKos({
      nama: kos.nama,
      alamat: kos.alamat,
      gambar: kos.gambar || []
    });
    setEditPreviewImages(kos.gambar || []);
    setEditProfileImageIndex(kos.gambarProfil || 0);
    setShowPengaturanKosModal(true);
  };

  const handleOpenDeleteConfirm = () => {
    setShowDeleteConfirm(true);
    setDeleteConfirmText('');
  };

  // Image handlers for Kos
  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      
      const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'));
      if (invalidFiles.length > 0) return;
      
      const largeFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
      if (largeFiles.length > 0) return;

      const promises = fileArray.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(imageUrls => {
        const newImages = [...editPreviewImages, ...imageUrls];
        setEditPreviewImages(newImages);
        setEditFormKos({ ...editFormKos, gambar: newImages });
      });
    }
  };

  const handleRemoveEditImage = (index: number) => {
    const newImages = editPreviewImages.filter((_, i) => i !== index);
    setEditPreviewImages(newImages);
    setEditFormKos({ ...editFormKos, gambar: newImages });
    
    if (editProfileImageIndex >= newImages.length) {
      setEditProfileImageIndex(Math.max(0, newImages.length - 1));
    } else if (editProfileImageIndex === index && newImages.length > 0) {
      setEditProfileImageIndex(0);
    }
  };

  const handleSetEditProfileImage = (index: number) => {
    setEditProfileImageIndex(index);
  };

  // Image handlers for Kamar
  const handleKamarImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      
      const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'));
      if (invalidFiles.length > 0) return;
      
      const largeFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
      if (largeFiles.length > 0) return;

      const promises = fileArray.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(imageUrls => {
        const newImages = [...kamarPreviewImages, ...imageUrls];
        setKamarPreviewImages(newImages);
        setFormKamar({ ...formKamar, gambar: newImages });
      });
    }
  };

  const handleRemoveKamarImage = (index: number) => {
    const newImages = kamarPreviewImages.filter((_, i) => i !== index);
    setKamarPreviewImages(newImages);
    setFormKamar({ ...formKamar, gambar: newImages });
    
    if (kamarProfileImageIndex >= newImages.length) {
      setKamarProfileImageIndex(Math.max(0, newImages.length - 1));
    } else if (kamarProfileImageIndex === index && newImages.length > 0) {
      setKamarProfileImageIndex(0);
    }
  };

  const handleSetKamarProfileImage = (index: number) => {
    setKamarProfileImageIndex(index);
  };

  // Fasilitas handlers
  const handleAddFasilitas = () => {
    if (newFasilitas.trim() && !formKamar.fasilitas.includes(newFasilitas.trim())) {
      setFormKamar({
        ...formKamar,
        fasilitas: [...formKamar.fasilitas, newFasilitas.trim()]
      });
      setNewFasilitas('');
    }
  };

  const handleRemoveFasilitas = (fasilitas: string) => {
    setFormKamar({
      ...formKamar,
      fasilitas: formKamar.fasilitas.filter(f => f !== fasilitas)
    });
  };

  // Save handlers
  const handleSavePengaturanKos = () => {
    if (selectedKosForKamar && editFormKos.nama && editFormKos.alamat) {
      updateKos(selectedKosForKamar.id, {
        nama: editFormKos.nama,
        alamat: editFormKos.alamat,
        gambar: editFormKos.gambar,
        gambarProfil: editProfileImageIndex
      });
      
      setShowPengaturanKosModal(false);
      setEditFormKos({ nama: '', alamat: '', gambar: [] });
      setEditPreviewImages([]);
      setEditProfileImageIndex(0);
      setSelectedKosForKamar(null);
    }
  };

  const handleDeleteKos = () => {
    if (selectedKosForKamar && deleteConfirmText === selectedKosForKamar.nama) {
      removeKos(selectedKosForKamar.id);
      setShowDeleteConfirm(false);
      setShowPengaturanKosModal(false);
      setDeleteConfirmText('');
      setEditFormKos({ nama: '', alamat: '', gambar: [] });
      setEditPreviewImages([]);
      setEditProfileImageIndex(0);
      setSelectedKosForKamar(null);
      
      if (onBack) {
        onBack();
      }
    }
  };

  const handleTambahKamar = () => {
    if (selectedKosForKamar && formKamar.nama) {
      const jumlah = formKamar.jumlahKamar || 1;
      
      if (jumlah === 1) {
        addKamarToKos(selectedKosForKamar.id, {
          nama: formKamar.nama,
          status: 'kosong',
          hargaSewa: formKamar.hargaSewa,
          luasKamar: formKamar.luasKamar,
          fasilitas: formKamar.fasilitas,
          maxPenghuni: 1,
          gambar: formKamar.gambar,
          gambarProfil: kamarProfileImageIndex
        });
      } else {
        for (let i = 1; i <= jumlah; i++) {
          setTimeout(() => {
            addKamarToKos(selectedKosForKamar.id, {
              nama: `${formKamar.nama} ${i}`,
              status: 'kosong',
              hargaSewa: formKamar.hargaSewa,
              luasKamar: formKamar.luasKamar,
              fasilitas: [...formKamar.fasilitas],
              maxPenghuni: 1,
              gambar: [...formKamar.gambar],
              gambarProfil: kamarProfileImageIndex
            });
          }, i * 10);
        }
      }
      
      setShowTambahKamarModal(false);
      setFormKamar({ nama: '', jumlahKamar: 1, hargaSewa: 0, luasKamar: 0, fasilitas: [], gambar: [] });
      setKamarPreviewImages([]);
      setKamarProfileImageIndex(0);
      setSelectedKosForKamar(null);
    }
  };

  return {
    // States
    showTambahKamarModal,
    setShowTambahKamarModal,
    showPengaturanKosModal,
    setShowPengaturanKosModal,
    showDeleteConfirm,
    setShowDeleteConfirm,
    selectedKosForKamar,
    setSelectedKosForKamar,
    editFormKos,
    setEditFormKos,
    editPreviewImages,
    editProfileImageIndex,
    deleteConfirmText,
    setDeleteConfirmText,
    formKamar,
    setFormKamar,
    kamarPreviewImages,
    kamarProfileImageIndex,
    newFasilitas,
    setNewFasilitas,
    
    // Handlers
    handleOpenTambahKamar,
    handleOpenPengaturanKos,
    handleOpenDeleteConfirm,
    handleEditImageUpload,
    handleRemoveEditImage,
    handleSetEditProfileImage,
    handleKamarImageUpload,
    handleRemoveKamarImage,
    handleSetKamarProfileImage,
    handleAddFasilitas,
    handleRemoveFasilitas,
    handleSavePengaturanKos,
    handleDeleteKos,
    handleTambahKamar
  };
};
