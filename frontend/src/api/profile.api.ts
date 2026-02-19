import { api } from './client';
import { User } from '../types/user.types';

export const profileApi = {
  get: () => api.get<User>('/profile'),

  update: (data: { displayName?: string; steamId?: string }) =>
    api.put<User>('/profile', data),
};
