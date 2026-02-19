import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteRepository } from '../../../../domain/repositories/note.repository';
import { Note } from '../../../../domain/entities/note.entity';
import { NoteOrmEntity } from '../entities/note.orm-entity';
import { NoteMapper } from '../mappers/note.mapper';

@Injectable()
export class TypeOrmNoteRepository implements NoteRepository {
  constructor(
    @InjectRepository(NoteOrmEntity)
    private readonly ormRepo: Repository<NoteOrmEntity>,
  ) {}

  async findByGameId(gameId: string, userId: string): Promise<Note[]> {
    const entities = await this.ormRepo.find({
      where: { gameId, userId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => NoteMapper.toDomain(e));
  }

  async findById(id: string): Promise<Note | null> {
    const entity = await this.ormRepo.findOneBy({ id });
    return entity ? NoteMapper.toDomain(entity) : null;
  }

  async save(note: Note): Promise<Note> {
    const ormEntity = NoteMapper.toOrm(note);
    const saved = await this.ormRepo.save(ormEntity);
    return NoteMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }
}
