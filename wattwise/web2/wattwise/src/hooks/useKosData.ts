import { useState, useEffect, useCallback } from 'react';
import { kosService } from '../services';
import { Kos } from '../context/types';

/**
 * Custom hook untuk fetch kos data dari API
 * Menggantikan localStorage dengan API calls
 */
export const useKosData = () => {
  const [kosList, setKosList] = useState<Kos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch kos list dari API
  const fetchKosList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await kosService.getKosList();
      setKosList(data);
    } catch (err: any) {
      console.error('Error fetching kos list:', err);
      setError(err.message || 'Gagal memuat data kos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchKosList();
  }, [fetchKosList]);

  // Add kos
  const addKos = useCallback(async (kosData: {
    nama: string;
    alamat: string;
    fasilitas?: string[];
    gambar?: string[];
  }) => {
    try {
      const newKos = await kosService.createKos(kosData);
      setKosList(prev => [...prev, newKos]);
      return newKos;
    } catch (err: any) {
      console.error('Error adding kos:', err);
      throw err;
    }
  }, []);

  // Update kos
  const updateKos = useCallback(async (kosId: string, updates: any) => {
    try {
      const updatedKos = await kosService.updateKos(kosId, updates);
      setKosList(prev => prev.map(kos => kos.id === kosId ? updatedKos : kos));
      return updatedKos;
    } catch (err: any) {
      console.error('Error updating kos:', err);
      throw err;
    }
  }, []);

  // Delete kos
  const deleteKos = useCallback(async (kosId: string) => {
    try {
      await kosService.deleteKos(kosId);
      setKosList(prev => prev.filter(kos => kos.id !== kosId));
    } catch (err: any) {
      console.error('Error deleting kos:', err);
      throw err;
    }
  }, []);

  // Add kamar to kos
  const addKamarToKos = useCallback(async (kosId: string, kamarData: any) => {
    try {
      await kosService.addKamar(kosId, kamarData);
      // Refresh kos list to get updated data
      await fetchKosList();
    } catch (err: any) {
      console.error('Error adding kamar:', err);
      throw err;
    }
  }, [fetchKosList]);

  // Update kamar in kos
  const updateKamarInKos = useCallback(async (kosId: string, kamarId: string, updates: any) => {
    try {
      await kosService.updateKamar(kosId, kamarId, updates);
      // Refresh kos list to get updated data
      await fetchKosList();
    } catch (err: any) {
      console.error('Error updating kamar:', err);
      throw err;
    }
  }, [fetchKosList]);

  // Delete kamar from kos
  const deleteKamarFromKos = useCallback(async (kosId: string, kamarId: string) => {
    try {
      await kosService.deleteKamar(kosId, kamarId);
      // Refresh kos list to get updated data
      await fetchKosList();
    } catch (err: any) {
      console.error('Error deleting kamar:', err);
      throw err;
    }
  }, [fetchKosList]);

  return {
    kosList,
    loading,
    error,
    refetch: fetchKosList,
    addKos,
    updateKos,
    deleteKos,
    addKamarToKos,
    updateKamarInKos,
    deleteKamarFromKos
  };
};

/**
 * Custom hook untuk fetch single kos dengan detail lengkap
 */
export const useKosDetail = (kosId: string | null) => {
  const [kos, setKos] = useState<Kos | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKosDetail = useCallback(async () => {
    if (!kosId) {
      setKos(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await kosService.getKosById(kosId);
      setKos(data);
    } catch (err: any) {
      console.error('Error fetching kos detail:', err);
      setError(err.message || 'Gagal memuat detail kos');
    } finally {
      setLoading(false);
    }
  }, [kosId]);

  useEffect(() => {
    fetchKosDetail();
  }, [fetchKosDetail]);

  return {
    kos,
    loading,
    error,
    refetch: fetchKosDetail
  };
};

/**
 * Custom hook untuk payments
 */
export const usePayments = (kosId: string | null, kamarId: string | null) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    if (!kosId || !kamarId) {
      setPayments([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await kosService.getPayments(kosId, kamarId);
      setPayments(data);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err.message || 'Gagal memuat data pembayaran');
    } finally {
      setLoading(false);
    }
  }, [kosId, kamarId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const createPayment = useCallback(async (paymentData: any) => {
    if (!kosId || !kamarId) return;

    try {
      const newPayment = await kosService.createPayment(kosId, kamarId, paymentData);
      setPayments(prev => [...prev, newPayment]);
      return newPayment;
    } catch (err: any) {
      console.error('Error creating payment:', err);
      throw err;
    }
  }, [kosId, kamarId]);

  const updatePayment = useCallback(async (paymentId: string, updates: any) => {
    if (!kosId || !kamarId) return;

    try {
      const updatedPayment = await kosService.updatePayment(kosId, kamarId, paymentId, updates);
      setPayments(prev => prev.map(p => p.id === paymentId ? updatedPayment : p));
      return updatedPayment;
    } catch (err: any) {
      console.error('Error updating payment:', err);
      throw err;
    }
  }, [kosId, kamarId]);

  const confirmPayment = useCallback(async (paymentId: string, data?: any) => {
    if (!kosId || !kamarId) return;

    try {
      const confirmedPayment = await kosService.confirmPayment(kosId, kamarId, paymentId, data);
      setPayments(prev => prev.map(p => p.id === paymentId ? confirmedPayment : p));
      return confirmedPayment;
    } catch (err: any) {
      console.error('Error confirming payment:', err);
      throw err;
    }
  }, [kosId, kamarId]);

  return {
    payments,
    loading,
    error,
    refetch: fetchPayments,
    createPayment,
    updatePayment,
    confirmPayment
  };
};
