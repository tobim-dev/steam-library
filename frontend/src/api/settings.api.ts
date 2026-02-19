import { api } from './client';
import { Settings } from '../types/settings.types';

export const settingsApi = {
  get: () => api.get<Settings>('/settings'),

  update: (data: { steamApiKey?: string }) =>
    api.put<Settings>('/settings', data),
};
