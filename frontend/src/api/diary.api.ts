import { api } from './client';
import { DiaryEntry } from '../types/diary.types';

export interface CreateDiaryEntryInput {
  gameId?: string | null;
  title: string;
  content: string;
  playDate: string;
  hoursPlayed?: number | null;
  rating?: number | null;
}

export interface UpdateDiaryEntryInput {
  title?: string;
  content?: string;
  playDate?: string;
  hoursPlayed?: number | null;
  rating?: number | null;
}

export const diaryApi = {
  getAll: (params?: { gameId?: string; sort?: string; order?: string }) => {
    const query = new URLSearchParams();
    if (params?.gameId) query.set('gameId', params.gameId);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.order) query.set('order', params.order);
    const qs = query.toString();
    return api.get<DiaryEntry[]>(`/diary${qs ? `?${qs}` : ''}`);
  },

  getForGame: (gameId: string) =>
    api.get<DiaryEntry[]>(`/games/${gameId}/diary`),

  create: (input: CreateDiaryEntryInput) =>
    api.post<DiaryEntry>('/diary', input),

  update: (id: string, input: UpdateDiaryEntryInput) =>
    api.put<DiaryEntry>(`/diary/${id}`, input),

  delete: (id: string) =>
    api.delete<{ success: boolean }>(`/diary/${id}`),
};
