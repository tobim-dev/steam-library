import { Note } from '../../../../domain/entities/note.entity';
import { NoteOrmEntity } from '../entities/note.orm-entity';

export class NoteMapper {
  static toDomain(orm: NoteOrmEntity): Note {
    return new Note(
      orm.id,
      orm.gameId,
      orm.content,
      orm.createdAt,
      orm.updatedAt,
      orm.userId,
    );
  }

  static toOrm(domain: Note): NoteOrmEntity {
    const orm = new NoteOrmEntity();
    orm.id = domain.id;
    orm.gameId = domain.gameId;
    orm.content = domain.content;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    orm.userId = domain.userId;
    return orm;
  }
}
