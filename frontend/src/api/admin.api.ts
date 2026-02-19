import { api } from './client';
import { User, CreateUserInput, UpdateUserInput } from '../types/user.types';

export const adminApi = {
  getUsers: () => api.get<User[]>('/admin/users'),

  createUser: (data: CreateUserInput) =>
    api.post<User>('/admin/users', data),

  updateUser: (id: string, data: UpdateUserInput) =>
    api.put<User>(`/admin/users/${id}`, data),

  deleteUser: (id: string) =>
    api.delete<{ success: boolean }>(`/admin/users/${id}`),

  syncAll: () =>
    api.post<{ totalUsers: number; successCount: number; results: Array<{ userId: string; username: string; success: boolean; error?: string }> }>('/admin/sync-all'),
};
