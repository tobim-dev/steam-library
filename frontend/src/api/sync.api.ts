import { api } from './client';

export interface SyncResult {
  success: boolean;
  message: string;
  added: number;
  updated: number;
  total: number;
}

export const syncApi = {
  syncSteam: () => api.post<SyncResult>('/sync/steam'),
};
