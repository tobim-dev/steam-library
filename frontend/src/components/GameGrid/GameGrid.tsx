import { Game } from '../../types/game.types';
import { GameCard } from '../GameCard/GameCard';
import styles from './GameGrid.module.css';

interface GameGridProps {
  games: Game[];
}

export function GameGrid({ games }: GameGridProps) {
  return (
    <div className={styles.grid}>
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
