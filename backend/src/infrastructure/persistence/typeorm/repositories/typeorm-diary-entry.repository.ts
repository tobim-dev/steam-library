import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryEntryRepository } from '../../../../domain/repositories/diary-entry.repository';
import { DiaryEntry } from '../../../../domain/entities/diary-entry.entity';
import { DiaryEntryOrmEntity } from '../entities/diary-entry.orm-entity';
import { DiaryEntryMapper } from '../mappers/diary-entry.mapper';

@Injectable()
export class TypeOrmDiaryEntryRepository implements DiaryEntryRepository {
  constructor(
    @InjectRepository(DiaryEntryOrmEntity)
    private readonly ormRepo: Repository<DiaryEntryOrmEntity>,
  ) {}

  async findAll(options?: {
    gameId?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<DiaryEntry[]> {
    const qb = this.ormRepo.createQueryBuilder('entry');

    if (options?.gameId) {
      qb.where('entry.gameId = :gameId', { gameId: options.gameId });
    }

    const sortField = this.getSortField(options?.sort);
    const order = (options?.order?.toUpperCase() as 'ASC' | 'DESC') || 'DESC';
    qb.orderBy(`entry.${sortField}`, order);

    const entities = await qb.getMany();
    return entities.map(DiaryEntryMapper.toDomain);
  }

  async findByGameId(gameId: string): Promise<DiaryEntry[]> {
    const entities = await this.ormRepo.find({
      where: { gameId },
      order: { playDate: 'DESC' },
    });
    return entities.map(DiaryEntryMapper.toDomain);
  }

  async findById(id: string): Promise<DiaryEntry | null> {
    const entity = await this.ormRepo.findOneBy({ id });
    return entity ? DiaryEntryMapper.toDomain(entity) : null;
  }

  async save(entry: DiaryEntry): Promise<DiaryEntry> {
    const ormEntity = DiaryEntryMapper.toOrm(entry);
    const saved = await this.ormRepo.save(ormEntity);
    return DiaryEntryMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }

  private getSortField(sort?: string): string {
    const allowed = ['playDate', 'createdAt', 'title'];
    if (sort && allowed.includes(sort)) return sort;
    return 'playDate';
  }
}
