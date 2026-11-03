import { useState, useEffect } from 'react';
import { Kos, Kamar } from '../../context/types';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../../context/storage';

export const useKosManagement = () => {
  const [kosList, setKosList] = useState<Kos[]>(() =>
    loadFromStorage(STORAGE_KEYS.KOS, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.KOS, kosList);
  }, [kosList]);

  const addKos = (kos: Omit<Kos, 'id' | 'jumlahKamar' | 'kamarTerisi' | 'kamarList'>) => {
    const newKos: Kos = {
      ...kos,
      id: `kos${Date.now()}`,
      jumlahKamar: 0,
      kamarTerisi: 0,
      kamarList: []
    };
    setKosList(prev => [...prev, newKos]);
  };

  const removeKos = (kosId: string) => {
    setKosList(prev => prev.filter(k => k.id !== kosId));
  };

  const updateKos = (kosId: string, updates: Partial<Kos>) => {
    setKosList(prev => prev.map(k => 
      k.id === kosId ? { ...k, ...updates } : k
    ));
  };

  const addKamarToKos = (kosId: string, kamar: Omit<Kamar, 'id'>) => {
    const newKamar: Kamar = {
      ...kamar,
      id: `k${Date.now()}`,
      status: 'kosong',
      luasKamar: kamar.luasKamar || 0
    };
    
    setKosList(prev => prev.map(kos => {
      if (kos.id === kosId) {
        const updatedKamarList = [...kos.kamarList, newKamar];
        const jumlahKamar = updatedKamarList.length;
        const kamarTerisi = updatedKamarList.filter(k => k.status === 'terisi').length;
        
        const hargaList = updatedKamarList.map(k => k.hargaSewa).filter(h => h > 0);
        const hargaMin = hargaList.length > 0 ? Math.min(...hargaList) : 0;
        const hargaMax = hargaList.length > 0 ? Math.max(...hargaList) : 0;
        
        return {
          ...kos,
          kamarList: updatedKamarList,
          jumlahKamar,
          kamarTerisi,
          hargaMin,
          hargaMax
        };
      }
      return kos;
    }));
  };

  const updateKamarInKos = (kosId: string, kamarId: string, updates: Partial<Kamar>) => {
    console.log('updateKamarInKos called:', { kosId, kamarId, updates });
    setKosList(prev => {
      console.log('Previous kosList:', prev);
      const newList = prev.map(kos => {
        if (kos.id === kosId) {
          const updatedKamarList = kos.kamarList.map(kamar => 
            kamar.id === kamarId ? { ...kamar, ...updates } : kamar
          );
          
          console.log('Updated kamarList:', updatedKamarList);
          
          const jumlahKamar = updatedKamarList.length;
          const kamarTerisi = updatedKamarList.filter(k => k.status === 'terisi').length;
          
          const hargaList = updatedKamarList.map(k => k.hargaSewa).filter(h => h > 0);
          const hargaMin = hargaList.length > 0 ? Math.min(...hargaList) : 0;
          const hargaMax = hargaList.length > 0 ? Math.max(...hargaList) : 0;
          
          return {
            ...kos,
            kamarList: updatedKamarList,
            jumlahKamar,
            kamarTerisi,
            hargaMin,
            hargaMax
          };
        }
        return kos;
      });
      console.log('New kosList:', newList);
      return newList;
    });
  };

  const deleteKamarFromKos = (kosId: string, kamarId: string) => {
    setKosList(prev => prev.map(kos => {
      if (kos.id === kosId) {
        const updatedKamarList = kos.kamarList.filter(kamar => kamar.id !== kamarId);
        
        const jumlahKamar = updatedKamarList.length;
        const kamarTerisi = updatedKamarList.filter(k => k.status === 'terisi').length;
        
        const hargaList = updatedKamarList.map(k => k.hargaSewa).filter(h => h > 0);
        const hargaMin = hargaList.length > 0 ? Math.min(...hargaList) : 0;
        const hargaMax = hargaList.length > 0 ? Math.max(...hargaList) : 0;
        
        return {
          ...kos,
          kamarList: updatedKamarList,
          jumlahKamar,
          kamarTerisi,
          hargaMin,
          hargaMax
        };
      }
      return kos;
    }));
  };

  return {
    kosList,
    addKos,
    removeKos,
    updateKos,
    addKamarToKos,
    updateKamarInKos,
    deleteKamarFromKos
  };
};
