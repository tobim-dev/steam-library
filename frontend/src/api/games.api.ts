import { api } from './client';
import type { Game } from '../types/game.types';

export const gamesApi = {
  getAll: (params?: { search?: string; sort?: string; order?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.order) query.set('order', params.order);
    const qs = query.toString();
    return api.get<Game[]>(`/games${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) => api.get<Game>(`/games/${id}`),
};
