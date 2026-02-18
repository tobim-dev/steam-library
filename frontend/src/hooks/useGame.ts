import { useState, useEffect, useCallback } from 'react';
import { gamesApi } from '../api/games.api';
import { Game } from '../types/game.types';

export function useGame(id: string) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await gamesApi.getById(id);
      setGame(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  return { game, loading, error, refetch: fetchGame };
}
