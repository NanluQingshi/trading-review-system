import axios from "axios";
import { Method, Trade, Stats } from "../types";

const API_BASE_URL = "http://localhost:5050/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Method API
export const methodsApi = {
  getMethods: () => api.get<{ success: boolean; data: Method[] }>("/methods"),
  getMethod: (id: string) =>
    api.get<{ success: boolean; data: Method }>(`/methods/${id}`),
  createMethod: (method: Partial<Method>) =>
    api.post<{ success: boolean; data: Method }>("/methods", method),
  updateMethod: (id: string, method: Partial<Method>) =>
    api.put<{ success: boolean; data: Method }>(`/methods/${id}`, method),
  deleteMethod: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/methods/${id}`),
};

// Trade API
export const tradesApi = {
  getTrades: (params?: any) =>
    api.get<{ success: boolean; data: Trade[] }>("/trades", { params }),
  getTrade: (id: number) =>
    api.get<{ success: boolean; data: Trade }>(`/trades/${id}`),
  createTrade: (trade: Partial<Trade>) =>
    api.post<{ success: boolean; data: Trade }>("/trades", trade),
  updateTrade: (id: number, trade: Partial<Trade>) =>
    api.put<{ success: boolean; data: Trade }>(`/trades/${id}`, trade),
  deleteTrade: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/trades/${id}`),
};

// Stats API
export const statsApi = {
  getStats: (params?: any) =>
    api.get<{ success: boolean; data: Stats }>("/stats", { params }),
  getRecent: (limit?: number) =>
    api.get<{ success: boolean; data: Trade[] }>("/stats/recent", {
      params: { limit },
    }),
};

export default api;
