import { DiaryEntry } from '../../../domain/entities/diary-entry.entity';
import { DiaryEntryRepository } from '../../../domain/repositories/diary-entry.repository';

export class GetDiaryEntriesUseCase {
  constructor(private readonly diaryEntryRepository: DiaryEntryRepository) {}

  async execute(options?: {
    gameId?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<DiaryEntry[]> {
    return this.diaryEntryRepository.findAll(options);
  }
}
