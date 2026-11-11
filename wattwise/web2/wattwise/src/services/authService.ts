import apiClient, { setAuthToken, clearAuthToken } from './apiClient';

export interface RegisterData {
  nama: string;
  email: string;
  no_telp: string;
  password: string;
  konfirmasiPassword: string;
  role?: 'owner' | 'penghuni' | 'admin';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      nama: string;
      email: string;
      no_telp: string;
      role: string;
    };
    token: string;
  };
}

class AuthService {
  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data);
    
    if (response.data.success && response.data.data?.token) {
      setAuthToken(response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  }

  /**
   * Login user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data);
    
    if (response.data.success && response.data.data?.token) {
      setAuthToken(response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  }

  /**
   * Logout user
   */
  logout(): void {
    clearAuthToken();
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<any> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): any | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    console.log('AuthService: Calling change-password endpoint');
    console.log('URL will be:', '/auth/change-password');
    const response = await apiClient.put('/auth/change-password', {
      oldPassword,
      newPassword
    });
    console.log('AuthService: Response received:', response.data);
    return response.data;
  }

  /**
   * Search penghuni by email or nama
   */
  async searchPenghuni(query: string): Promise<any> {
    if (!query || query.trim().length < 2) {
      return { success: true, data: [] };
    }
    const response = await apiClient.get(`/auth/search-penghuni?query=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export default new AuthService();
