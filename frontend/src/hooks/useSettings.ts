import { useState, useEffect, useCallback } from 'react';
import { settingsApi } from '../api/settings.api';
import { Settings } from '../types/settings.types';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await settingsApi.get();
      setSettings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load settings',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (data: {
    steamApiKey?: string;
    steamId?: string;
  }) => {
    const updated = await settingsApi.update(data);
    setSettings(updated);
    return updated;
  };

  return { settings, loading, error, updateSettings, refetch: fetchSettings };
}
