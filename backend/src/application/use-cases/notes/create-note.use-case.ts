import { Note } from '../../../domain/entities/note.entity';
import { NoteRepository } from '../../../domain/repositories/note.repository';
import { GameRepository } from '../../../domain/repositories/game.repository';
import { v4 as uuidv4 } from 'uuid';

export class CreateNoteUseCase {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly gameRepository: GameRepository,
  ) {}

  async execute(gameId: string, content: string): Promise<Note> {
    const game = await this.gameRepository.findById(gameId);
    if (!game) {
      throw new Error(`Game with id ${gameId} not found`);
    }

    const now = new Date();
    const note = new Note(uuidv4(), gameId, content, now, now);
    return this.noteRepository.save(note);
  }
}
