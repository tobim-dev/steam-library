import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/admin.api';
import { User, CreateUserInput } from '../../types/user.types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import styles from './AdminPage.module.css';

export function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (input: CreateUserInput) => {
    await adminApi.createUser(input);
    setShowCreateForm(false);
    await fetchUsers();
  };

  const handleToggleActive = async (user: User) => {
    try {
      await adminApi.updateUser(user.id, { isActive: !user.isActive });
      await fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Fehler');
    }
  };

  const handleChangeRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await adminApi.updateUser(user.id, { role: newRole });
      await fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Fehler');
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Benutzer "${user.username}" wirklich loeschen?`)) return;
    try {
      await adminApi.deleteUser(user.id);
      await fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Fehler');
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const result = await adminApi.syncAll();
      setSyncResult(
        `Sync abgeschlossen: ${result.successCount}/${result.totalUsers} erfolgreich`,
      );
    } catch (err) {
      setSyncResult(
        err instanceof Error ? err.message : 'Sync fehlgeschlagen',
      );
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Benutzerverwaltung</h1>
        <div className={styles.headerActions}>
          <button
            className={styles.btnSync}
            onClick={handleSyncAll}
            disabled={syncing}
          >
            {syncing ? 'Synchronisiere...' : 'Alle synchronisieren'}
          </button>
          <button
            className={styles.btnCreate}
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Abbrechen' : 'Neuer Benutzer'}
          </button>
        </div>
      </div>

      {syncResult && <div className={styles.syncResult}>{syncResult}</div>}

      {showCreateForm && (
        <CreateUserForm
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Benutzername</th>
              <th>Anzeigename</th>
              <th>Rolle</th>
              <th>Steam ID</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={!user.isActive ? styles.inactive : ''}
              >
                <td>{user.username}</td>
                <td>{user.displayName}</td>
                <td>
                  <span
                    className={`${styles.badge} ${user.role === 'admin' ? styles.badgeAdmin : styles.badgeUser}`}
                  >
                    {user.role === 'admin' ? 'Admin' : 'Benutzer'}
                  </span>
                </td>
                <td className={styles.steamId}>
                  {user.steamId || (
                    <span className={styles.muted}>&mdash;</span>
                  )}
                </td>
                <td>
                  <span
                    className={`${styles.badge} ${user.isActive ? styles.badgeActive : styles.badgeInactive}`}
                  >
                    {user.isActive ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button
                    className={styles.btnAction}
                    onClick={() => handleToggleActive(user)}
                    title={user.isActive ? 'Deaktivieren' : 'Aktivieren'}
                  >
                    {user.isActive ? '\u23F8' : '\u25B6'}
                  </button>
                  <button
                    className={styles.btnAction}
                    onClick={() => handleChangeRole(user)}
                    title="Rolle wechseln"
                  >
                    \u21C5
                  </button>
                  <button
                    className={`${styles.btnAction} ${styles.btnDanger}`}
                    onClick={() => handleDelete(user)}
                    title="Loeschen"
                  >
                    \u2715
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateUserForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (input: CreateUserInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ username, displayName, password, role });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.createForm}>
      <h3 className={styles.formTitle}>Neuen Benutzer anlegen</h3>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Benutzername</label>
            <input
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
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
        </div>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Passwort</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Rolle</label>
            <select
              className={styles.input}
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
            >
              <option value="user">Benutzer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className={styles.formActions}>
          <button
            className={styles.btnCreate}
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Erstelle...' : 'Benutzer erstellen'}
          </button>
          <button
            className={styles.btnCancel}
            type="button"
            onClick={onCancel}
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
