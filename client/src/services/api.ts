import axios from 'axios';
import { Method, Trade, Stats } from '../types';
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Method API
export const methodsApi = {
  getAll: () => api.get<{ success: boolean; data: Method[] }>('/methods'),
  getById: (id: string) => api.get<{ success: boolean; data: Method }>(`/methods/${id}`),
  create: (method: Partial<Method>) => api.post<{ success: boolean; data: Method }>('/methods', method),
  update: (id: string, method: Partial<Method>) => api.put<{ success: boolean; data: Method }>(`/methods/${id}`, method),
  delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/methods/${id}`),
};

// Trade API
export const tradesApi = {
  getAll: (params?: any) => api.get<{ success: boolean; data: Trade[] }>('/trades', { params }),
  getById: (id: number) => api.get<{ success: boolean; data: Trade }>(`/trades/${id}`),
  create: (trade: Partial<Trade>) => api.post<{ success: boolean; data: Trade }>('/trades', trade),
  update: (id: number, trade: Partial<Trade>) => api.put<{ success: boolean; data: Trade }>(`/trades/${id}`, trade),
  delete: (id: number) => api.delete<{ success: boolean; message: string }>(`/trades/${id}`),
};

// Stats API
export const statsApi = {
  getStats: (params?: any) => api.get<{ success: boolean; data: Stats }>('/stats', { params }),
  getRecent: (limit?: number) => api.get<{ success: boolean; data: Trade[] }>('/stats/recent', { params: { limit } }),
};

export default api;
