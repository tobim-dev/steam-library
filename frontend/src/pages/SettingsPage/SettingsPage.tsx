import { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const { settings, loading, updateSettings } = useSettings();
  const [apiKey, setApiKey] = useState('');
  const [steamId, setSteamId] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setSteamId(settings.steamId || '');
      // Don't pre-fill the API key for security
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const data: { steamApiKey?: string; steamId?: string } = {};
      if (apiKey) data.steamApiKey = apiKey;
      if (steamId) data.steamId = steamId;
      await updateSettings(data);
      setSuccess(true);
      setApiKey(''); // Clear after save
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Einstellungen</h1>

      {/* Steam API Configuration */}
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h2 className={styles.cardTitle}>Steam API Konfiguration</h2>
          <span
            className={`${styles.statusBadge} ${
              settings?.isConfigured ? styles.configured : styles.notConfigured
            }`}
          >
            {settings?.isConfigured ? '\u2713 Konfiguriert' : '\u2717 Nicht konfiguriert'}
          </span>
        </div>

        <p className={styles.cardDescription}>
          Um deine Steam-Bibliothek zu synchronisieren, benoetigst du einen Steam Web API Key
          und deine Steam ID. Den API Key kannst du unter{' '}
          <a href="https://steamcommunity.com/dev/apikey" target="_blank" rel="noopener noreferrer">
            steamcommunity.com/dev/apikey
          </a>{' '}
          erstellen. Deine Steam ID findest du in deinem Steam-Profil.
        </p>

        <div className={styles.field}>
          <label className={styles.label}>Steam Web API Key</label>
          <input
            className={styles.input}
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={
              settings?.steamApiKeySet
                ? 'Bereits gesetzt (leer lassen zum Behalten)'
                : 'Dein Steam Web API Key'
            }
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Steam ID (64-Bit)</label>
          <input
            className={styles.input}
            type="text"
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            placeholder="z.B. 76561198012345678"
          />
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.btnSave}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Speichere...' : 'Einstellungen speichern'}
          </button>
        </div>

        {success && (
          <div className={styles.successMsg}>
            Einstellungen erfolgreich gespeichert!
          </div>
        )}
      </div>

      {/* Sync Status */}
      {settings?.lastSyncAt && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Synchronisierungs-Status</h2>
          <div className={styles.syncInfo}>
            <div className={styles.syncRow}>
              <span className={styles.syncLabel}>Letzte Synchronisierung</span>
              <span className={styles.syncValue}>
                {formatDate(settings.lastSyncAt)}
              </span>
            </div>
            {settings.lastSyncGameCount !== null && (
              <div className={styles.syncRow}>
                <span className={styles.syncLabel}>Spiele synchronisiert</span>
                <span className={styles.syncValue}>
                  {settings.lastSyncGameCount}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
