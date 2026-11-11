import apiClient from './apiClient';

export interface Device {
  _id: string;
  nama: string;
  deviceId: string;
  kamarId: string;
  ownerId: string;
  tipe: string;
  status: string;
  lastData?: {
    voltage: number;
    current: number;
    power: number;
    energy: number;
    frequency: number;
    powerFactor: number;
    timestamp: string;
  };
  lastUpdate?: string;
  mqttTopic?: string;
  deskripsi?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddDeviceData {
  nama: string;
  deviceId: string;
  kamarId: string;
  tipe?: string;
  deskripsi?: string;
}

class DeviceService {
  /**
   * Add new device
   */
  async addDevice(data: AddDeviceData): Promise<any> {
    const response = await apiClient.post('/devices', data);
    return response.data;
  }

  /**
   * Get devices by room ID
   */
  async getDevicesByRoom(kamarId: string): Promise<any> {
    const response = await apiClient.get(`/devices/room/${kamarId}`);
    return response.data;
  }

  /**
   * Get device by ID
   */
  async getDeviceById(deviceId: string): Promise<any> {
    const response = await apiClient.get(`/devices/${deviceId}`);
    return response.data;
  }

  /**
   * Update device
   */
  async updateDevice(deviceId: string, data: Partial<AddDeviceData>): Promise<any> {
    const response = await apiClient.put(`/devices/${deviceId}`, data);
    return response.data;
  }

  /**
   * Delete device
   */
  async deleteDevice(deviceId: string): Promise<any> {
    const response = await apiClient.delete(`/devices/${deviceId}`);
    return response.data;
  }
}

export default new DeviceService();
