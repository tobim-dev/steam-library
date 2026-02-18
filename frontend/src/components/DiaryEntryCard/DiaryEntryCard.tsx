import { useNavigate } from 'react-router-dom';
import { DiaryEntry } from '../../types/diary.types';
import styles from './DiaryEntryCard.module.css';

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  gameName?: string;
  onDelete?: (id: string) => void;
  showGameBadge?: boolean;
}

export function DiaryEntryCard({
  entry,
  gameName,
  onDelete,
  showGameBadge = false,
}: DiaryEntryCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return '\u2605'.repeat(rating) + '\u2606'.repeat(5 - rating);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{entry.title}</h3>
        <span className={styles.date}>{formatDate(entry.playDate)}</span>
      </div>

      <div className={styles.content}>{entry.content}</div>

      <div className={styles.meta}>
        {showGameBadge && entry.gameId && gameName && (
          <span
            className={styles.gameBadge}
            onClick={() => navigate(`/library/${entry.gameId}`)}
          >
            &#127918; {gameName}
          </span>
        )}

        {entry.rating && (
          <span className={styles.stars}>{renderStars(entry.rating)}</span>
        )}

        {entry.hoursPlayed !== null && entry.hoursPlayed !== undefined && (
          <span className={styles.metaItem}>
            &#9200; {entry.hoursPlayed}h gespielt
          </span>
        )}

        {onDelete && (
          <div className={styles.actions}>
            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              onClick={() => onDelete(entry.id)}
            >
              Entfernen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
