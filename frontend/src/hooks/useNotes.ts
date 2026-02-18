import { useState, useEffect, useCallback } from 'react';
import { notesApi } from '../api/notes.api';
import { Note } from '../types/note.types';

export function useNotes(gameId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notesApi.getForGame(gameId);
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (content: string) => {
    const note = await notesApi.create(gameId, content);
    setNotes((prev) => [note, ...prev]);
    return note;
  };

  const updateNote = async (id: string, content: string) => {
    const updated = await notesApi.update(id, content);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  };

  const deleteNote = async (id: string) => {
    await notesApi.delete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return { notes, loading, error, createNote, updateNote, deleteNote, refetch: fetchNotes };
}
