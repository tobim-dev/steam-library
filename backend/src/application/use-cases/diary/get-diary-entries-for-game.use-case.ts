import { DiaryEntry } from '../../../domain/entities/diary-entry.entity';
import { DiaryEntryRepository } from '../../../domain/repositories/diary-entry.repository';

export class GetDiaryEntriesForGameUseCase {
  constructor(
    private readonly diaryEntryRepository: DiaryEntryRepository,
  ) {}

  async execute(gameId: string): Promise<DiaryEntry[]> {
    return this.diaryEntryRepository.findByGameId(gameId);
  }
}
