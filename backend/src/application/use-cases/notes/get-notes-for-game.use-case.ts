import { Note } from '../../../domain/entities/note.entity';
import { NoteRepository } from '../../../domain/repositories/note.repository';

export class GetNotesForGameUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(userId: string, gameId: string): Promise<Note[]> {
    return this.noteRepository.findByGameId(gameId, userId);
  }
}
