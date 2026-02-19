import { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth.api';
import styles from './ChangePasswordPage.module.css';

export function ChangePasswordPage() {
  const { refreshUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Die Passwoerter stimmen nicht ueberein');
      return;
    }

    if (newPassword.length < 4) {
      setError('Das neue Passwort muss mindestens 4 Zeichen lang sein');
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      await refreshUser();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Fehler beim Aendern des Passworts',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>&#128274;</span>
          <h1 className={styles.title}>Passwort aendern</h1>
        </div>
        <p className={styles.subtitle}>
          Du musst dein Passwort aendern, bevor du fortfahren kannst.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

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

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Wird geaendert...' : 'Passwort aendern'}
          </button>
        </form>
      </div>
    </div>
  );
}
