import { NoteRepository } from '../../../domain/repositories/note.repository';

export class DeleteNoteUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.noteRepository.findById(id);
    if (!existing) {
      throw new Error(`Note with id ${id} not found`);
    }
    await this.noteRepository.delete(id);
  }
}
