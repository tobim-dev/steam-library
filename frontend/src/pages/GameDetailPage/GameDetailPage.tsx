import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../hooks/useGame';
import { useNotes } from '../../hooks/useNotes';
import { useDiary } from '../../hooks/useDiary';
import { NoteEditor } from '../../components/NoteEditor/NoteEditor';
import { DiaryEntryForm } from '../../components/DiaryEntryForm/DiaryEntryForm';
import { DiaryEntryCard } from '../../components/DiaryEntryCard/DiaryEntryCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import styles from './GameDetailPage.module.css';

export function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { game, loading, error } = useGame(id!);
  const { notes, createNote, updateNote, deleteNote } = useNotes(id!);
  const { entries, createEntry, deleteEntry } = useDiary(id!);
  const [activeTab, setActiveTab] = useState<'notes' | 'diary'>('notes');
  const [showDiaryForm, setShowDiaryForm] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (error || !game) {
    return (
      <EmptyState
        icon="&#9888;"
        title="Spiel nicht gefunden"
        description={error || 'Das Spiel konnte nicht geladen werden.'}
      />
    );
  }

  return (
    <div className={styles.page}>
      <button className={styles.backLink} onClick={() => navigate('/library')}>
        &#8592; Zurueck zur Bibliothek
      </button>

      {/* Hero Section */}
      <div className={styles.hero}>
        <img
          className={styles.heroImage}
          src={game.headerImageUrl}
          alt={game.name}
        />
        <div className={styles.heroOverlay}>
          <h1 className={styles.gameName}>{game.name}</h1>
          <div className={styles.stats}>
            <span className={styles.stat}>
              &#9200; <span className={styles.statValue}>{game.playtimeFormatted}</span> Spielzeit
            </span>
            {game.playtimeRecentMinutes !== null && game.playtimeRecentMinutes > 0 && (
              <span className={styles.stat}>
                &#128337; <span className={styles.statValue}>
                  {Math.floor(game.playtimeRecentMinutes / 60)}h {game.playtimeRecentMinutes % 60}m
                </span> letzte 2 Wochen
              </span>
            )}
            <a
              href={game.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.storeLink}
            >
              &#128279; Steam Store
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'notes' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notizen ({notes.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'diary' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('diary')}
        >
          Tagebuch ({entries.length})
        </button>
      </div>

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className={styles.section}>
          <NoteEditor
            notes={notes}
            onCreateNote={async (content) => {
              await createNote(content);
            }}
            onUpdateNote={async (noteId, content) => {
              await updateNote(noteId, content);
            }}
            onDeleteNote={async (noteId) => {
              await deleteNote(noteId);
            }}
          />
          {notes.length === 0 && (
            <EmptyState
              icon="&#128221;"
              title="Keine Notizen"
              description="Schreibe deine erste Notiz zu diesem Spiel."
            />
          )}
        </div>
      )}

      {/* Diary Tab */}
      {activeTab === 'diary' && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tagebucheintraege</h2>
            <button
              className={styles.toggleBtn}
              onClick={() => setShowDiaryForm(!showDiaryForm)}
            >
              {showDiaryForm ? 'Formular schliessen' : '+ Neuer Eintrag'}
            </button>
          </div>

          {showDiaryForm && (
            <DiaryEntryForm
              defaultGameId={game.id}
              onSubmit={async (data) => {
                await createEntry(data);
                setShowDiaryForm(false);
              }}
              onCancel={() => setShowDiaryForm(false)}
            />
          )}

          {entries.map((entry) => (
            <DiaryEntryCard
              key={entry.id}
              entry={entry}
              onDelete={(entryId) => deleteEntry(entryId)}
            />
          ))}

          {entries.length === 0 && !showDiaryForm && (
            <EmptyState
              icon="&#128214;"
              title="Keine Eintraege"
              description="Erstelle deinen ersten Tagebucheintrag zu diesem Spiel."
            />
          )}
        </div>
      )}
    </div>
  );
}
