import { api } from './client';
import { LoginResponse, User } from '../types/user.types';

export const authApi = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { username, password }),

  me: () => api.get<User>('/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<{ success: boolean; user: User }>('/auth/change-password', {
      currentPassword,
      newPassword,
    }),
};
