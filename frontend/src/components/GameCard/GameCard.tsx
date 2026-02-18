import { useNavigate } from 'react-router-dom';
import { Game } from '../../types/game.types';
import styles from './GameCard.module.css';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/library/${game.id}`)}>
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={game.headerImageUrl}
          alt={game.name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 215"><rect fill="%232a475e" width="460" height="215"/><text fill="%238f98a0" x="230" y="115" text-anchor="middle" font-size="16">No Image</text></svg>';
          }}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.name} title={game.name}>
          {game.name}
        </div>
        <div className={styles.meta}>
          <span className={styles.playtime}>
            {game.playtimeFormatted}
          </span>
          {game.hasBeenPlayed ? (
            <span className={styles.badge}>Gespielt</span>
          ) : (
            <span className={`${styles.badge} ${styles.notPlayed}`}>
              Neu
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
