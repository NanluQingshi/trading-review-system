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
  getMethods: () =>
    api.get<{ success: boolean; data: Method[] }>("/methods/list"),
  getMethod: (id: string) =>
    api.get<{ success: boolean; data: Method }>(`/methods/detail/${id}`),
  createMethod: (method: Partial<Method>) =>
    api.post<{ success: boolean; data: Method }>("/methods/create", method),
  updateMethod: (id: string, method: Partial<Method>) =>
    api.put<{ success: boolean; data: Method }>(
      `/methods/update/${id}`,
      method,
    ),
  deleteMethod: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/methods/delete/${id}`),
};

// Trade API
export const tradesApi = {
  getTrades: (params?: any) =>
    api.get<{ success: boolean; data: Trade[] }>("/trades/list", { params }),
  getTrade: (id: number) =>
    api.get<{ success: boolean; data: Trade }>(`/trades/detail/${id}`),
  createTrade: (trade: Partial<Trade>) =>
    api.post<{ success: boolean; data: Trade }>("/trades/create", trade),
  updateTrade: (id: number, trade: Partial<Trade>) =>
    api.put<{ success: boolean; data: Trade }>(`/trades/update/${id}`, trade),
  deleteTrade: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/trades/delete/${id}`),
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
