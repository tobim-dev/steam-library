import { useState } from 'react';
import { Note } from '../../types/note.types';
import styles from './NoteEditor.module.css';

interface NoteEditorProps {
  notes: Note[];
  onCreateNote: (content: string) => Promise<void>;
  onUpdateNote: (id: string, content: string) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
}

export function NoteEditor({
  notes,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
}: NoteEditorProps) {
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!newContent.trim()) return;
    setSaving(true);
    try {
      await onCreateNote(newContent.trim());
      setNewContent('');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editContent.trim() || !editingId) return;
    setSaving(true);
    try {
      await onUpdateNote(editingId, editContent.trim());
      setEditingId(null);
      setEditContent('');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* New note form */}
      <div className={styles.editor}>
        <textarea
          className={styles.textarea}
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Neue Notiz schreiben..."
        />
        {newContent.trim() && (
          <div className={styles.actions}>
            <button
              className={`${styles.btn} ${styles.btnCancel}`}
              onClick={() => setNewContent('')}
            >
              Abbrechen
            </button>
            <button
              className={`${styles.btn} ${styles.btnSave}`}
              onClick={handleCreate}
              disabled={saving}
            >
              Speichern
            </button>
          </div>
        )}
      </div>

      {/* Existing notes */}
      {notes.map((note) => (
        <div key={note.id} className={styles.noteItem}>
          {editingId === note.id ? (
            <div className={styles.editor}>
              <textarea
                className={styles.textarea}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className={styles.actions}>
                <button
                  className={`${styles.btn} ${styles.btnCancel}`}
                  onClick={() => setEditingId(null)}
                >
                  Abbrechen
                </button>
                <button
                  className={`${styles.btn} ${styles.btnSave}`}
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  Aktualisieren
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.noteContent}>{note.content}</div>
              <div className={styles.noteMeta}>
                <span className={styles.noteDate}>
                  {formatDate(note.updatedAt)}
                </span>
                <div className={styles.noteActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => startEditing(note)}
                  >
                    Bearbeiten
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => onDeleteNote(note.id)}
                  >
                    Entfernen
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
