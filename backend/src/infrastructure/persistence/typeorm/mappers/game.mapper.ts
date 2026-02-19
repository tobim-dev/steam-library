import { Game } from '../../../../domain/entities/game.entity';
import { GameOrmEntity } from '../entities/game.orm-entity';

export class GameMapper {
  static toDomain(orm: GameOrmEntity): Game {
    return new Game(
      orm.id,
      orm.steamAppId,
      orm.name,
      orm.headerImageUrl,
      orm.storeUrl,
      orm.playtimeForeverMinutes,
      orm.playtimeRecentMinutes,
      orm.iconUrl,
      orm.lastSyncedAt,
      orm.createdAt,
      orm.updatedAt,
      orm.userId,
    );
  }

  static toOrm(domain: Game): GameOrmEntity {
    const orm = new GameOrmEntity();
    orm.id = domain.id;
    orm.steamAppId = domain.steamAppId;
    orm.name = domain.name;
    orm.headerImageUrl = domain.headerImageUrl;
    orm.storeUrl = domain.storeUrl;
    orm.playtimeForeverMinutes = domain.playtimeForeverMinutes;
    orm.playtimeRecentMinutes = domain.playtimeRecentMinutes;
    orm.iconUrl = domain.iconUrl;
    orm.lastSyncedAt = domain.lastSyncedAt;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    orm.userId = domain.userId;
    return orm;
  }
}
