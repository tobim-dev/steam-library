import { DiaryEntry } from '../entities/diary-entry.entity';

export interface DiaryEntryRepository {
  findAll(
    userId: string,
    options?: {
      gameId?: string;
      sort?: string;
      order?: 'asc' | 'desc';
    },
  ): Promise<DiaryEntry[]>;
  findByGameId(gameId: string, userId: string): Promise<DiaryEntry[]>;
  findById(id: string): Promise<DiaryEntry | null>;
  save(entry: DiaryEntry): Promise<DiaryEntry>;
  delete(id: string): Promise<void>;
}
