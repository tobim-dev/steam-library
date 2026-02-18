import { Settings } from '../../../../domain/entities/settings.entity';
import { SettingsOrmEntity } from '../entities/settings.orm-entity';

export class SettingsMapper {
  static toDomain(orm: SettingsOrmEntity): Settings {
    return new Settings(
      orm.id,
      orm.steamApiKey,
      orm.steamId,
      orm.lastSyncAt,
      orm.lastSyncGameCount,
    );
  }

  static toOrm(domain: Settings): SettingsOrmEntity {
    const orm = new SettingsOrmEntity();
    orm.id = domain.id;
    orm.steamApiKey = domain.steamApiKey;
    orm.steamId = domain.steamId;
    orm.lastSyncAt = domain.lastSyncAt;
    orm.lastSyncGameCount = domain.lastSyncGameCount;
    return orm;
  }
}
