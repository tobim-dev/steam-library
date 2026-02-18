import { useState, useEffect, useCallback } from 'react';
import { diaryApi, CreateDiaryEntryInput, UpdateDiaryEntryInput } from '../api/diary.api';
import { DiaryEntry } from '../types/diary.types';

export function useDiary(gameId?: string) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = gameId
        ? await diaryApi.getForGame(gameId)
        : await diaryApi.getAll();
      setEntries(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load diary entries',
      );
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const createEntry = async (input: CreateDiaryEntryInput) => {
    const entry = await diaryApi.create(input);
    setEntries((prev) => [entry, ...prev]);
    return entry;
  };

  const updateEntry = async (id: string, input: UpdateDiaryEntryInput) => {
    const updated = await diaryApi.update(id, input);
    setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const deleteEntry = async (id: string) => {
    await diaryApi.delete(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries,
  };
}
