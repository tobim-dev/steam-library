import { useState } from 'react';
import { syncApi, SyncResult } from '../api/sync.api';

export function useSync() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sync = async () => {
    setSyncing(true);
    setError(null);
    setResult(null);
    try {
      const data = await syncApi.syncSteam();
      setResult(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Sync failed';
      setError(message);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  return { sync, syncing, result, error };
}
