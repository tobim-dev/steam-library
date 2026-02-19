import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileApi } from '../../api/profile.api';
import { authApi } from '../../api/auth.api';
import { User } from '../../types/user.types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [displayName, setDisplayName] = useState('');
  const [steamId, setSteamId] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    profileApi.get().then((data) => {
      setProfile(data);
      setDisplayName(data.displayName);
      setSteamId(data.steamId || '');
      setLoading(false);
    });
  }, []);

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);
    try {
      const updated = await profileApi.update({
        displayName,
        steamId: steamId || undefined,
      });
      setProfile(updated);
      setProfileSuccess(true);
      await refreshUser();
      setTimeout(() => setProfileSuccess(false), 3000);
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('Die Passwoerter stimmen nicht ueberein');
      return;
    }

    setPasswordSaving(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : 'Fehler beim Aendern',
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mein Profil</h1>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Profil-Informationen</h2>
        <form onSubmit={handleProfileSave} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Benutzername</label>
            <input
              className={styles.input}
              value={profile?.username || ''}
              disabled
            />
            <span className={styles.hint}>Kann nicht geaendert werden</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Anzeigename</label>
            <input
              className={styles.input}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Steam ID (64-Bit)</label>
            <input
              className={styles.input}
              value={steamId}
              onChange={(e) => setSteamId(e.target.value)}
              placeholder="z.B. 76561198012345678"
            />
            <span className={styles.hint}>
              Deine Steam ID findest du in deinem Steam-Profil
            </span>
          </div>

          <button
            className={styles.btnSave}
            type="submit"
            disabled={profileSaving}
          >
            {profileSaving ? 'Speichere...' : 'Profil speichern'}
          </button>

          {profileSuccess && (
            <div className={styles.success}>
              Profil erfolgreich gespeichert!
            </div>
          )}
        </form>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Passwort aendern</h2>
        <form onSubmit={handlePasswordChange} className={styles.form}>
          {passwordError && (
            <div className={styles.error}>{passwordError}</div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Aktuelles Passwort</label>
            <input
              className={styles.input}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Neues Passwort</label>
            <input
              className={styles.input}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={4}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Neues Passwort bestaetigen</label>
            <input
              className={styles.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={4}
            />
          </div>

          <button
            className={styles.btnPassword}
            type="submit"
            disabled={passwordSaving}
          >
            {passwordSaving ? 'Wird geaendert...' : 'Passwort aendern'}
          </button>

          {passwordSuccess && (
            <div className={styles.success}>
              Passwort erfolgreich geaendert!
            </div>
          )}
        </form>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Konto-Informationen</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Rolle</span>
            <span className={styles.infoValue}>
              {profile?.role === 'admin' ? 'Administrator' : 'Benutzer'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Erstellt am</span>
            <span className={styles.infoValue}>
              {profile
                ? new Date(profile.createdAt).toLocaleDateString('de-DE')
                : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
