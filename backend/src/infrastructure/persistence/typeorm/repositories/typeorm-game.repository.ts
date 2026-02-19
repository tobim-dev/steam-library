import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameRepository } from '../../../../domain/repositories/game.repository';
import { Game } from '../../../../domain/entities/game.entity';
import { GameOrmEntity } from '../entities/game.orm-entity';
import { GameMapper } from '../mappers/game.mapper';

@Injectable()
export class TypeOrmGameRepository implements GameRepository {
  constructor(
    @InjectRepository(GameOrmEntity)
    private readonly ormRepo: Repository<GameOrmEntity>,
  ) {}

  async findAll(
    userId: string,
    options?: {
      search?: string;
      sort?: string;
      order?: 'asc' | 'desc';
    },
  ): Promise<Game[]> {
    const qb = this.ormRepo.createQueryBuilder('game');

    qb.where('game.userId = :userId', { userId });

    if (options?.search) {
      qb.andWhere('game.name LIKE :search', {
        search: `%${options.search}%`,
      });
    }

    const sortField = this.getSortField(options?.sort);
    const order = (options?.order?.toUpperCase() as 'ASC' | 'DESC') || 'ASC';
    qb.orderBy(`game.${sortField}`, order);

    const entities = await qb.getMany();
    return entities.map((e) => GameMapper.toDomain(e));
  }

  async findById(id: string): Promise<Game | null> {
    const entity = await this.ormRepo.findOneBy({ id });
    return entity ? GameMapper.toDomain(entity) : null;
  }

  async findBySteamAppId(
    steamAppId: number,
    userId: string,
  ): Promise<Game | null> {
    const entity = await this.ormRepo.findOneBy({ steamAppId, userId });
    return entity ? GameMapper.toDomain(entity) : null;
  }

  async save(game: Game): Promise<Game> {
    const ormEntity = GameMapper.toOrm(game);
    const saved = await this.ormRepo.save(ormEntity);
    return GameMapper.toDomain(saved);
  }

  async saveMany(games: Game[]): Promise<Game[]> {
    const ormEntities = games.map((g) => GameMapper.toOrm(g));
    const saved = await this.ormRepo.save(ormEntities);
    return saved.map((s) => GameMapper.toDomain(s));
  }

  async count(userId?: string): Promise<number> {
    if (userId) {
      return this.ormRepo.count({ where: { userId } });
    }
    return this.ormRepo.count();
  }

  private getSortField(sort?: string): string {
    const allowed = [
      'name',
      'playtimeForeverMinutes',
      'lastSyncedAt',
      'createdAt',
    ];
    if (sort && allowed.includes(sort)) return sort;
    return 'name';
  }
}
