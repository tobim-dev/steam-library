import { Note } from '../entities/note.entity';

export interface NoteRepository {
  findByGameId(gameId: string): Promise<Note[]>;
  findById(id: string): Promise<Note | null>;
  save(note: Note): Promise<Note>;
  delete(id: string): Promise<void>;
}
