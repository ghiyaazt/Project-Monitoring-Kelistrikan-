import { useState, useEffect } from 'react';
import { Perangkat } from '../../context/types';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../../context/storage';

export const usePerangkatManagement = () => {
  const [perangkatList, setPerangkatList] = useState<Perangkat[]>(() =>
    loadFromStorage(STORAGE_KEYS.PERANGKAT, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PERANGKAT, perangkatList);
  }, [perangkatList]);

  const addPerangkat = (perangkat: Omit<Perangkat, 'id'>) => {
    const newPerangkat: Perangkat = {
      ...perangkat,
      id: `p${Date.now()}`,
    };
    setPerangkatList(prev => [...prev, newPerangkat]);
  };

  const removePerangkat = (id: string) => {
    setPerangkatList(prev => prev.filter(p => p.id !== id));
  };

  return {
    perangkatList,
    addPerangkat,
    removePerangkat
  };
};
