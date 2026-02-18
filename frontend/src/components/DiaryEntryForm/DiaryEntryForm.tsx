import { useState } from 'react';
import { Game } from '../../types/game.types';
import styles from './DiaryEntryForm.module.css';

interface DiaryEntryFormProps {
  games?: Game[];
  defaultGameId?: string | null;
  onSubmit: (data: {
    gameId?: string | null;
    title: string;
    content: string;
    playDate: string;
    hoursPlayed?: number | null;
    rating?: number | null;
  }) => Promise<void>;
  onCancel?: () => void;
}

export function DiaryEntryForm({
  games,
  defaultGameId,
  onSubmit,
  onCancel,
}: DiaryEntryFormProps) {
  const [gameId, setGameId] = useState(defaultGameId || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [playDate, setPlayDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [hoursPlayed, setHoursPlayed] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      await onSubmit({
        gameId: gameId || null,
        title: title.trim(),
        content: content.trim(),
        playDate: new Date(playDate).toISOString(),
        hoursPlayed: hoursPlayed ? parseFloat(hoursPlayed) : null,
        rating,
      });
      // Reset form
      setTitle('');
      setContent('');
      setHoursPlayed('');
      setRating(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.formTitle}>Neuer Tagebucheintrag</h3>

      {games && !defaultGameId && (
        <div className={styles.field}>
          <label className={styles.label}>Spiel (optional)</label>
          <select
            className={styles.select}
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          >
            <option value="">-- Kein Spiel --</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>Titel</label>
        <input
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="z.B. Erster Boss besiegt!"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Eintrag</label>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Beschreibe dein Spielerlebnis..."
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Spieldatum</label>
          <input
            className={styles.input}
            type="date"
            value={playDate}
            onChange={(e) => setPlayDate(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Stunden gespielt</label>
          <input
            className={styles.input}
            type="number"
            step="0.5"
            min="0"
            value={hoursPlayed}
            onChange={(e) => setHoursPlayed(e.target.value)}
            placeholder="z.B. 2.5"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Bewertung</label>
        <div className={styles.ratingStars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={styles.star}
              onClick={() => setRating(rating === star ? null : star)}
            >
              {star <= (rating || 0) ? '\u2605' : '\u2606'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <button
            type="button"
            className={`${styles.btn} ${styles.btnCancel}`}
            onClick={onCancel}
          >
            Abbrechen
          </button>
        )}
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnSubmit}`}
          disabled={saving || !title.trim() || !content.trim()}
        >
          {saving ? 'Speichere...' : 'Speichern'}
        </button>
      </div>
    </form>
  );
}
