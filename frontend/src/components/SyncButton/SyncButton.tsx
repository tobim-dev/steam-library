import { useSync } from '../../hooks/useSync';
import styles from './SyncButton.module.css';

interface SyncButtonProps {
  onSyncComplete?: () => void;
}

export function SyncButton({ onSyncComplete }: SyncButtonProps) {
  const { sync, syncing, result, error } = useSync();

  const handleSync = async () => {
    try {
      await sync();
      onSyncComplete?.();
    } catch {
      // Error is handled by the hook
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button
        className={styles.button}
        onClick={handleSync}
        disabled={syncing}
      >
        <span className={syncing ? styles.spinning : ''}>
          &#x21bb;
        </span>
        {syncing ? 'Synchronisiere...' : 'Steam Sync'}
      </button>

      {result && (
        <span className={`${styles.result} ${styles.success}`}>
          +{result.added} neu, {result.updated} aktualisiert ({result.total} gesamt)
        </span>
      )}

      {error && (
        <span className={`${styles.result} ${styles.error}`}>
          {error}
        </span>
      )}
    </div>
  );
}
