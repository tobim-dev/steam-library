import { DiaryEntry } from '../../../domain/entities/diary-entry.entity';
import { DiaryEntryRepository } from '../../../domain/repositories/diary-entry.repository';
import { GameRepository } from '../../../domain/repositories/game.repository';
import { randomUUID } from 'crypto';

export interface CreateDiaryEntryInput {
  gameId?: string | null;
  title: string;
  content: string;
  playDate: Date;
  hoursPlayed?: number | null;
  rating?: number | null;
}

export class CreateDiaryEntryUseCase {
  constructor(
    private readonly diaryEntryRepository: DiaryEntryRepository,
    private readonly gameRepository: GameRepository,
  ) {}

  async execute(input: CreateDiaryEntryInput): Promise<DiaryEntry> {
    if (input.gameId) {
      const game = await this.gameRepository.findById(input.gameId);
      if (!game) {
        throw new Error(`Game with id ${input.gameId} not found`);
      }
    }

    if (input.rating !== undefined && input.rating !== null) {
      if (input.rating < 1 || input.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
    }

    const now = new Date();
    const entry = new DiaryEntry(
      randomUUID(),
      input.gameId ?? null,
      input.title,
      input.content,
      input.playDate,
      input.hoursPlayed ?? null,
      input.rating ?? null,
      now,
      now,
    );
    return this.diaryEntryRepository.save(entry);
  }
}
