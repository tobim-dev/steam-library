import { Note } from '../../../domain/entities/note.entity';
import { NoteRepository } from '../../../domain/repositories/note.repository';

export class UpdateNoteUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(id: string, content: string): Promise<Note> {
    const existing = await this.noteRepository.findById(id);
    if (!existing) {
      throw new Error(`Note with id ${id} not found`);
    }

    const updated = new Note(
      existing.id,
      existing.gameId,
      content,
      existing.createdAt,
      new Date(),
    );
    return this.noteRepository.save(updated);
  }
}
