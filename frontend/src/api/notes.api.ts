import { api } from './client';
import { Note } from '../types/note.types';

export const notesApi = {
  getForGame: (gameId: string) =>
    api.get<Note[]>(`/games/${gameId}/notes`),

  create: (gameId: string, content: string) =>
    api.post<Note>(`/games/${gameId}/notes`, { content }),

  update: (id: string, content: string) =>
    api.put<Note>(`/notes/${id}`, { content }),

  delete: (id: string) => api.delete<{ success: boolean }>(`/notes/${id}`),
};
