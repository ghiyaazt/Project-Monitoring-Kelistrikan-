import apiClient from './apiClient';

export interface RoomData {
  nama: string;
  kosId: string;
  status?: 'kosong' | 'terisi';
  hargaSewa: number;
  luasKamar: number;
  fasilitas?: string[];
  maxPenghuni?: number;
  gambar?: string[];
  gambarProfil?: number;
}

class RoomService {
  /**
   * Create new room
   */
  async createRoom(data: RoomData): Promise<any> {
    const response = await apiClient.post('/rooms', data);
    return response.data;
  }

  /**
   * Get all rooms (filtered by role)
   */
  async getAllRooms(params?: { status?: string; kosId?: string }): Promise<any> {
    const response = await apiClient.get('/rooms', { params });
    return response.data;
  }

  /**
   * Get room by ID
   */
  async getRoomById(id: string): Promise<any> {
    const response = await apiClient.get(`/rooms/${id}`);
    return response.data;
  }

  /**
   * Update room
   */
  async updateRoom(id: string, data: Partial<RoomData>): Promise<any> {
    const response = await apiClient.put(`/rooms/${id}`, data);
    return response.data;
  }

  /**
   * Delete room
   */
  async deleteRoom(id: string): Promise<any> {
    const response = await apiClient.delete(`/rooms/${id}`);
    return response.data;
  }

  /**
   * Get room statistics
   */
  async getRoomStats(): Promise<any> {
    const response = await apiClient.get('/rooms/stats');
    return response.data;
  }

  /**
   * Get penghuni list of a room
   */
  async getRoomPenghuni(id: string): Promise<any> {
    const response = await apiClient.get(`/rooms/${id}/penghuni`);
    return response.data;
  }
}

export default new RoomService();
