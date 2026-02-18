import { useState, useEffect } from 'react';
import { useDiary } from '../../hooks/useDiary';
import { useGames } from '../../hooks/useGames';
import { DiaryEntryForm } from '../../components/DiaryEntryForm/DiaryEntryForm';
import { DiaryEntryCard } from '../../components/DiaryEntryCard/DiaryEntryCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import styles from './DiaryPage.module.css';

export function DiaryPage() {
  const { games } = useGames();
  const { entries, loading, createEntry, deleteEntry } = useDiary();
  const [showForm, setShowForm] = useState(false);
  const [filterGameId, setFilterGameId] = useState('');

  // Build a map of gameId -> gameName for display
  const gameNameMap = new Map(games.map((g) => [g.id, g.name]));

  const filteredEntries = filterGameId
    ? entries.filter((e) => e.gameId === filterGameId)
    : entries;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tagebuch</h1>
        <button
          className={styles.toggleBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Schliessen' : '+ Neuer Eintrag'}
        </button>
      </div>

      {showForm && (
        <DiaryEntryForm
          games={games}
          onSubmit={async (data) => {
            await createEntry(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className={styles.toolbar}>
        <select
          className={styles.filterSelect}
          value={filterGameId}
          onChange={(e) => setFilterGameId(e.target.value)}
        >
          <option value="">Alle Spiele</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredEntries.length === 0 ? (
        <EmptyState
          icon="&#128214;"
          title="Keine Tagebucheintraege"
          description={
            filterGameId
              ? 'Keine Eintraege fuer dieses Spiel gefunden.'
              : 'Erstelle deinen ersten Tagebucheintrag, um deine Spielerfahrungen festzuhalten.'
          }
        />
      ) : (
        filteredEntries.map((entry) => (
          <DiaryEntryCard
            key={entry.id}
            entry={entry}
            gameName={entry.gameId ? gameNameMap.get(entry.gameId) : undefined}
            showGameBadge={!filterGameId}
            onDelete={(id) => deleteEntry(id)}
          />
        ))
      )}
    </div>
  );
}
