import { Note } from '../../../domain/entities/note.entity';
import { NoteRepository } from '../../../domain/repositories/note.repository';
import { GameRepository } from '../../../domain/repositories/game.repository';
import { randomUUID } from 'crypto';

export class CreateNoteUseCase {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly gameRepository: GameRepository,
  ) {}

  async execute(
    userId: string,
    gameId: string,
    content: string,
  ): Promise<Note> {
    const game = await this.gameRepository.findById(gameId);
    if (!game) {
      throw new Error(`Game with id ${gameId} not found`);
    }

    const now = new Date();
    const note = new Note(randomUUID(), gameId, content, now, now, userId);
    return this.noteRepository.save(note);
  }
}
