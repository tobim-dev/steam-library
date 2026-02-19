import { DiaryEntry } from '../../../domain/entities/diary-entry.entity';
import { DiaryEntryRepository } from '../../../domain/repositories/diary-entry.repository';

export interface UpdateDiaryEntryInput {
  title?: string;
  content?: string;
  playDate?: Date;
  hoursPlayed?: number | null;
  rating?: number | null;
}

export class UpdateDiaryEntryUseCase {
  constructor(private readonly diaryEntryRepository: DiaryEntryRepository) {}

  async execute(
    userId: string,
    id: string,
    input: UpdateDiaryEntryInput,
  ): Promise<DiaryEntry> {
    const existing = await this.diaryEntryRepository.findById(id);
    if (!existing) {
      throw new Error(`Diary entry with id ${id} not found`);
    }

    if (existing.userId !== userId) {
      throw new Error('Keine Berechtigung');
    }

    if (input.rating !== undefined && input.rating !== null) {
      if (input.rating < 1 || input.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
    }

    const updated = new DiaryEntry(
      existing.id,
      existing.gameId,
      input.title ?? existing.title,
      input.content ?? existing.content,
      input.playDate ?? existing.playDate,
      input.hoursPlayed !== undefined
        ? input.hoursPlayed
        : existing.hoursPlayed,
      input.rating !== undefined ? input.rating : existing.rating,
      existing.createdAt,
      new Date(),
      existing.userId,
    );
    return this.diaryEntryRepository.save(updated);
  }
}
