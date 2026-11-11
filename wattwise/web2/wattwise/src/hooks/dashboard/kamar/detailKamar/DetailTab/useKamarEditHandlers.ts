import { Kamar } from '../../../../../types/dashboard/kamar/detailKamar';

interface UseKamarEditHandlersProps {
  kamar: Kamar;
  kosId: string | null;
  kamarId: string | undefined;
  setKamar: React.Dispatch<React.SetStateAction<Kamar>>;
  editFormKamar: Kamar;
  setEditFormKamar: React.Dispatch<React.SetStateAction<Kamar>>;
  editKamarImages: string[];
  setEditKamarImages: React.Dispatch<React.SetStateAction<string[]>>;
  editKamarProfileIndex: number;
  setEditKamarProfileIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setNewFasilitas: React.Dispatch<React.SetStateAction<string>>;
  newFasilitas: string;
  updateKamarInKos: (kosId: string, kamarId: string, updates: Partial<Kamar>) => void;
  deleteKamarFromKos: (kosId: string, kamarId: string) => void;
  onBack?: () => void;
}

export const useKamarEditHandlers = (props: UseKamarEditHandlersProps) => {
  const {
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
    setNewFasilitas,
    newFasilitas,
    updateKamarInKos,
    deleteKamarFromKos,
    onBack
  } = props;

  const handleStartEdit = () => {
    setEditFormKamar(kamar);
    setEditKamarImages(kamar.gambar || []);
    setEditKamarProfileIndex(kamar.gambarProfil || 0);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormKamar(kamar);
    setNewFasilitas('');
    setEditKamarImages(kamar.gambar || []);
    setEditKamarProfileIndex(kamar.gambarProfil || 0);
  };

  const handleSaveEdit = () => {
    const updatedKamar = {
      ...editFormKamar,
      gambar: editKamarImages,
      gambarProfil: editKamarImages.length > 0 ? editKamarProfileIndex : 0
    };
    
    setKamar(updatedKamar);
    
    if (kosId && kamarId) {
      updateKamarInKos(kosId, kamarId, updatedKamar);
    }
    
    setIsEditMode(false);
    setNewFasilitas('');
  };

  const handleEditKamarImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      const base64Array = await Promise.all(
        validFiles.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      setEditKamarImages(prev => [...prev, ...base64Array]);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleRemoveEditKamarImage = (index: number) => {
    setEditKamarImages(prev => prev.filter((_, i) => i !== index));
    if (editKamarProfileIndex === index) {
      setEditKamarProfileIndex(0);
    } else if (editKamarProfileIndex > index) {
      setEditKamarProfileIndex(prev => prev - 1);
    }
  };

  const handleSetEditKamarProfileImage = (index: number) => {
    setEditKamarProfileIndex(index);
  };

  const handleDeleteKamar = () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${kamar.nama}"? Tindakan ini tidak dapat dibatalkan!`)) {
      if (kosId && kamarId) {
        deleteKamarFromKos(kosId, kamarId);
        
        if (onBack) {
          onBack();
        }
      }
    }
  };

  const handleAddFasilitas = () => {
    if (newFasilitas.trim() && !editFormKamar.fasilitas.includes(newFasilitas.trim())) {
      setEditFormKamar({
        ...editFormKamar,
        fasilitas: [...editFormKamar.fasilitas, newFasilitas.trim()]
      });
      setNewFasilitas('');
    }
  };

  const handleRemoveFasilitas = (fasilitas: string) => {
    setEditFormKamar({
      ...editFormKamar,
      fasilitas: editFormKamar.fasilitas.filter(f => f !== fasilitas)
    });
  };

  return {
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleEditKamarImageUpload,
    handleRemoveEditKamarImage,
    handleSetEditKamarProfileImage,
    handleDeleteKamar,
    handleAddFasilitas,
    handleRemoveFasilitas
  };
};
