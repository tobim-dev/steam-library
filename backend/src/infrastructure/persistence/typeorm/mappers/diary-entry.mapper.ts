import { DiaryEntry } from '../../../../domain/entities/diary-entry.entity';
import { DiaryEntryOrmEntity } from '../entities/diary-entry.orm-entity';

export class DiaryEntryMapper {
  static toDomain(orm: DiaryEntryOrmEntity): DiaryEntry {
    return new DiaryEntry(
      orm.id,
      orm.gameId,
      orm.title,
      orm.content,
      orm.playDate,
      orm.hoursPlayed,
      orm.rating,
      orm.createdAt,
      orm.updatedAt,
      orm.userId,
    );
  }

  static toOrm(domain: DiaryEntry): DiaryEntryOrmEntity {
    const orm = new DiaryEntryOrmEntity();
    orm.id = domain.id;
    orm.gameId = domain.gameId;
    orm.title = domain.title;
    orm.content = domain.content;
    orm.playDate = domain.playDate;
    orm.hoursPlayed = domain.hoursPlayed;
    orm.rating = domain.rating;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    orm.userId = domain.userId;
    return orm;
  }
}
