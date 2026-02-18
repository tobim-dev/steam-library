import { DiaryEntryRepository } from '../../../domain/repositories/diary-entry.repository';

export class DeleteDiaryEntryUseCase {
  constructor(private readonly diaryEntryRepository: DiaryEntryRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.diaryEntryRepository.findById(id);
    if (!existing) {
      throw new Error(`Diary entry with id ${id} not found`);
    }
    await this.diaryEntryRepository.delete(id);
  }
}
