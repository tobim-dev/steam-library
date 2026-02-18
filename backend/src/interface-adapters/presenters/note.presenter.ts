import { Note } from '../../domain/entities/note.entity';

export class NotePresenter {
  static toResponse(note: Note) {
    return {
      id: note.id,
      gameId: note.gameId,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    };
  }
}
