import { DiaryEntry } from '../../domain/entities/diary-entry.entity';

export class DiaryEntryPresenter {
  static toResponse(entry: DiaryEntry) {
    return {
      id: entry.id,
      gameId: entry.gameId,
      title: entry.title,
      content: entry.content,
      playDate:
        entry.playDate instanceof Date
          ? entry.playDate.toISOString()
          : entry.playDate,
      hoursPlayed: entry.hoursPlayed,
      rating: entry.rating,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    };
  }
}
