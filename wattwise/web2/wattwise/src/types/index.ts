// Export semua global TypeScript types
// Contoh: ApiResponse, PaginationParams, dll
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export type Theme = 'light' | 'dark' | 'system';
