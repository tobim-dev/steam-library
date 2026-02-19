import { DiaryEntryRepository } from '../../../domain/repositories/diary-entry.repository';

export class DeleteDiaryEntryUseCase {
  constructor(private readonly diaryEntryRepository: DiaryEntryRepository) {}

  async execute(userId: string, id: string): Promise<void> {
    const existing = await this.diaryEntryRepository.findById(id);
    if (!existing) {
      throw new Error(`Diary entry with id ${id} not found`);
    }

    if (existing.userId !== userId) {
      throw new Error('Keine Berechtigung');
    }

    await this.diaryEntryRepository.delete(id);
  }
}
