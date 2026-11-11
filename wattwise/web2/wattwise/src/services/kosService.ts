import apiClient from './apiClient';
import { Kos } from '../context/types';

class KosService {
  /**
   * Get all kos owned by current user
   */
  async getKosList(): Promise<Kos[]> {
    try {
      const response = await apiClient.get('/web2/kos');
      return response.data.data || [];
    } catch (error) {
      console.error('Get kos list error:', error);
      throw error;
    }
  }

  /**
   * Get single kos with full details
   */
  async getKosById(kosId: string): Promise<Kos> {
    try {
      const response = await apiClient.get(`/web2/kos/${kosId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get kos by ID error:', error);
      throw error;
    }
  }

  /**
   * Create new kos
   */
  async createKos(data: {
    nama: string;
    alamat: string;
    fasilitas?: string[];
    gambar?: string[];
  }): Promise<Kos> {
    try {
      const response = await apiClient.post('/web2/kos', data);
      return response.data.data;
    } catch (error) {
      console.error('Create kos error:', error);
      throw error;
    }
  }

  /**
   * Update kos
   */
  async updateKos(kosId: string, data: {
    nama?: string;
    alamat?: string;
    fasilitas?: string[];
    gambar?: string[];
    gambarProfil?: number;
  }): Promise<Kos> {
    try {
      const response = await apiClient.put(`/web2/kos/${kosId}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Update kos error:', error);
      throw error;
    }
  }

  /**
   * Delete kos
   */
  async deleteKos(kosId: string): Promise<void> {
    try {
      await apiClient.delete(`/web2/kos/${kosId}`);
    } catch (error) {
      console.error('Delete kos error:', error);
      throw error;
    }
  }

  /**
   * Add kamar to kos
   */
  async addKamar(kosId: string, data: {
    nama: string;
    hargaSewa: number;
    luasKamar: number;
    fasilitas?: string[];
    maxPenghuni?: number;
    gambar?: string[];
  }): Promise<any> {
    try {
      const response = await apiClient.post(`/web2/kos/${kosId}/kamar`, data);
      return response.data.data;
    } catch (error) {
      console.error('Add kamar error:', error);
      throw error;
    }
  }

  /**
   * Update kamar
   */
  async updateKamar(kosId: string, kamarId: string, data: {
    nama?: string;
    hargaSewa?: number;
    luasKamar?: number;
    fasilitas?: string[];
    maxPenghuni?: number;
    gambar?: string[];
    gambarProfil?: number;
    status?: 'terisi' | 'kosong';
  }): Promise<any> {
    try {
      const response = await apiClient.put(`/web2/kos/${kosId}/kamar/${kamarId}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Update kamar error:', error);
      throw error;
    }
  }

  /**
   * Delete kamar
   */
  async deleteKamar(kosId: string, kamarId: string): Promise<void> {
    try {
      await apiClient.delete(`/web2/kos/${kosId}/kamar/${kamarId}`);
    } catch (error) {
      console.error('Delete kamar error:', error);
      throw error;
    }
  }

  /**
   * Add penghuni to kamar
   */
  async addPenghuni(kosId: string, kamarId: string, data: {
    nama: string;
    email: string;
    telepon: string;
    tanggalMasuk?: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post(`/web2/kos/${kosId}/kamar/${kamarId}/penghuni`, data);
      return response.data.data;
    } catch (error) {
      console.error('Add penghuni error:', error);
      throw error;
    }
  }

  /**
   * Update penghuni
   */
  async updatePenghuni(kosId: string, kamarId: string, penghuniId: string, data: {
    nama?: string;
    email?: string;
    telepon?: string;
    tanggalMasuk?: string;
  }): Promise<any> {
    try {
      const response = await apiClient.put(`/web2/kos/${kosId}/kamar/${kamarId}/penghuni/${penghuniId}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Update penghuni error:', error);
      throw error;
    }
  }

  /**
   * Remove penghuni
   */
  async removePenghuni(kosId: string, kamarId: string, penghuniId: string): Promise<void> {
    try {
      await apiClient.delete(`/web2/kos/${kosId}/kamar/${kamarId}/penghuni/${penghuniId}`);
    } catch (error) {
      console.error('Remove penghuni error:', error);
      throw error;
    }
  }

  /**
   * Get payments for kamar
   */
  async getPayments(kosId: string, kamarId: string, filters?: {
    tahun?: number;
    bulan?: string;
    status?: string;
  }): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.tahun) params.append('tahun', filters.tahun.toString());
      if (filters?.bulan) params.append('bulan', filters.bulan);
      if (filters?.status) params.append('status', filters.status);

      const response = await apiClient.get(`/web2/kos/${kosId}/kamar/${kamarId}/payments?${params.toString()}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Get payments error:', error);
      throw error;
    }
  }

  /**
   * Create payment
   */
  async createPayment(kosId: string, kamarId: string, data: {
    penghuniId?: string;
    bulan: string;
    tahun: number;
    jumlah: number;
    tanggalJatuhTempo?: string;
    keterangan?: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post(`/web2/kos/${kosId}/kamar/${kamarId}/payments`, data);
      return response.data.data;
    } catch (error) {
      console.error('Create payment error:', error);
      throw error;
    }
  }

  /**
   * Update payment
   */
  async updatePayment(kosId: string, kamarId: string, paymentId: string, data: {
    status?: string;
    tanggalBayar?: string;
    metodePembayaran?: string;
    buktiPembayaran?: string;
    keterangan?: string;
  }): Promise<any> {
    try {
      const response = await apiClient.put(`/web2/kos/${kosId}/kamar/${kamarId}/payments/${paymentId}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Update payment error:', error);
      throw error;
    }
  }

  /**
   * Confirm payment
   */
  async confirmPayment(kosId: string, kamarId: string, paymentId: string, data?: {
    metodePembayaran?: string;
    buktiPembayaran?: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post(`/web2/kos/${kosId}/kamar/${kamarId}/payments/${paymentId}/confirm`, data || {});
      return response.data.data;
    } catch (error) {
      console.error('Confirm payment error:', error);
      throw error;
    }
  }
}

export default new KosService();
