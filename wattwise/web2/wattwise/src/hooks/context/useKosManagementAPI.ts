import { useState, useEffect, useCallback } from 'react';
import { kosService } from '../../services';
import { Kos } from '../../context/types';

/**
 * Hook untuk Kos Management dengan API integration
 * Menggantikan useKosManagement yang menggunakan localStorage
 * 
 * Toggle dengan environment variable: REACT_APP_USE_API=true
 */
export function useKosManagementAPI() {
  const USE_API = process.env.REACT_APP_USE_API === 'true';

  const [kosList, setKosList] = useState<Kos[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch kos list from API
  const fetchKosList = useCallback(async () => {
    if (!USE_API) return;

    try {
      setLoading(true);
      const data = await kosService.getKosList();
      setKosList(data);
    } catch (err: any) {
      console.error('Failed to fetch kos list:', err);
      setError(err.message || 'Gagal memuat data kos');
    } finally {
      setLoading(false);
    }
  }, [USE_API]);

  // Load on mount
  useEffect(() => {
    if (USE_API) {
      fetchKosList();
    }
  }, [USE_API, fetchKosList]);

  // Add kos
  const addKos = useCallback(async (kosData: Omit<Kos, 'id' | 'jumlahKamar' | 'kamarTerisi' | 'kamarList'>) => {
    if (USE_API) {
      try {
        const newKos = await kosService.createKos({
          nama: kosData.nama,
          alamat: kosData.alamat,
          fasilitas: kosData.fasilitas,
          gambar: kosData.gambar
        });
        setKosList(prev => [...prev, newKos]);
      } catch (err) {
        console.error('Failed to add kos:', err);
        throw err;
      }
    } else {
      // Fallback to localStorage (existing behavior)
      const newKos: Kos = {
        ...kosData,
        id: Date.now().toString(),
        jumlahKamar: 0,
        kamarTerisi: 0,
        kamarList: []
      };
      setKosList(prev => {
        const updated = [...prev, newKos];
        localStorage.setItem('wattwise_kos', JSON.stringify(updated));
        return updated;
      });
    }
  }, [USE_API]);

  // Remove kos
  const removeKos = useCallback(async (kosId: string) => {
    if (USE_API) {
      try {
        await kosService.deleteKos(kosId);
        setKosList(prev => prev.filter(k => k.id !== kosId));
      } catch (err) {
        console.error('Failed to remove kos:', err);
        throw err;
      }
    } else {
      // Fallback to localStorage
      setKosList(prev => {
        const updated = prev.filter(k => k.id !== kosId);
        localStorage.setItem('wattwise_kos', JSON.stringify(updated));
        return updated;
      });
    }
  }, [USE_API]);

  // Update kos
  const updateKos = useCallback(async (kosId: string, updates: Partial<Kos>) => {
    if (USE_API) {
      try {
        const updatedKos = await kosService.updateKos(kosId, updates);
        setKosList(prev => prev.map(k => k.id === kosId ? updatedKos : k));
      } catch (err) {
        console.error('Failed to update kos:', err);
        throw err;
      }
    } else {
      // Fallback to localStorage
      setKosList(prev => {
        const updated = prev.map(k => k.id === kosId ? { ...k, ...updates } : k);
        localStorage.setItem('wattwise_kos', JSON.stringify(updated));
        return updated;
      });
    }
  }, [USE_API]);

  // Add kamar to kos
  const addKamarToKos = useCallback(async (kosId: string, kamarData: any) => {
    if (USE_API) {
      try {
        await kosService.addKamar(kosId, kamarData);
        // Refresh list
        await fetchKosList();
      } catch (err) {
        console.error('Failed to add kamar:', err);
        throw err;
      }
    } else {
      // Fallback to localStorage (existing behavior)
      setKosList(prev => {
        const updated = prev.map(kos => {
          if (kos.id === kosId) {
            const newKamar = {
              ...kamarData,
              id: Date.now().toString(),
              status: 'kosong' as const,
              penghuniList: [],
              payments: []
            };
            return {
              ...kos,
              kamarList: [...kos.kamarList, newKamar],
              jumlahKamar: kos.kamarList.length + 1
            };
          }
          return kos;
        });
        localStorage.setItem('wattwise_kos', JSON.stringify(updated));
        return updated;
      });
    }
  }, [USE_API, fetchKosList]);

  // Update kamar in kos
  const updateKamarInKos = useCallback(async (kosId: string, kamarId: string, updates: any) => {
    if (USE_API) {
      try {
        await kosService.updateKamar(kosId, kamarId, updates);
        // Refresh list
        await fetchKosList();
      } catch (err) {
        console.error('Failed to update kamar:', err);
        throw err;
      }
    } else {
      // Fallback to localStorage
      setKosList(prev => {
        const updated = prev.map(kos => {
          if (kos.id === kosId) {
            return {
              ...kos,
              kamarList: kos.kamarList.map(kamar =>
                kamar.id === kamarId ? { ...kamar, ...updates } : kamar
              )
            };
          }
          return kos;
        });
        localStorage.setItem('wattwise_kos', JSON.stringify(updated));
        return updated;
      });
    }
  }, [USE_API, fetchKosList]);

  // Delete kamar from kos
  const deleteKamarFromKos = useCallback(async (kosId: string, kamarId: string) => {
    if (USE_API) {
      try {
        await kosService.deleteKamar(kosId, kamarId);
        // Refresh list
        await fetchKosList();
      } catch (err) {
        console.error('Failed to delete kamar:', err);
        throw err;
      }
    } else {
      // Fallback to localStorage
      setKosList(prev => {
        const updated = prev.map(kos => {
          if (kos.id === kosId) {
            return {
              ...kos,
              kamarList: kos.kamarList.filter(kamar => kamar.id !== kamarId),
              jumlahKamar: kos.kamarList.length - 1
            };
          }
          return kos;
        });
        localStorage.setItem('wattwise_kos', JSON.stringify(updated));
        return updated;
      });
    }
  }, [USE_API, fetchKosList]);

  return {
    kosList,
    loading,
    error,
    addKos,
    removeKos,
    updateKos,
    addKamarToKos,
    updateKamarInKos,
    deleteKamarFromKos,
    refetch: fetchKosList
  };
}
