import { useState, useCallback } from 'react';
import { useGames } from '../../hooks/useGames';
import { GameGrid } from '../../components/GameGrid/GameGrid';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { SyncButton } from '../../components/SyncButton/SyncButton';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import styles from './LibraryPage.module.css';

export function LibraryPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const { games, loading, error, refetch } = useGames(search, sort, order);

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
  }, []);

  if (error) {
    return (
      <EmptyState
        icon="&#9888;"
        title="Fehler beim Laden"
        description={error}
      />
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Bibliothek</h1>
          {games.length > 0 && (
            <span className={styles.count}>{games.length} Spiele</span>
          )}
        </div>
        <SyncButton onSyncComplete={refetch} />
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <SearchBar onSearch={handleSearch} />
        </div>
        <select
          className={styles.sortSelect}
          value={`${sort}-${order}`}
          onChange={(e) => {
            const [s, o] = e.target.value.split('-');
            setSort(s);
            setOrder(o);
          }}
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="playtimeForeverMinutes-desc">Meiste Spielzeit</option>
          <option value="playtimeForeverMinutes-asc">Wenigste Spielzeit</option>
          <option value="lastSyncedAt-desc">Zuletzt synchronisiert</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : games.length === 0 ? (
        <EmptyState
          icon="&#127918;"
          title="Keine Spiele gefunden"
          description={
            search
              ? `Keine Spiele fuer "${search}" gefunden.`
              : 'Synchronisiere deine Steam-Bibliothek, um deine Spiele hier zu sehen.'
          }
        >
          {!search && <SyncButton onSyncComplete={refetch} />}
        </EmptyState>
      ) : (
        <GameGrid games={games} />
      )}
    </div>
  );
}
