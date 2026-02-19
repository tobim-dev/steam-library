import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingsRepository } from '../../../../domain/repositories/settings.repository';
import { Settings } from '../../../../domain/entities/settings.entity';
import { SettingsOrmEntity } from '../entities/settings.orm-entity';
import { SettingsMapper } from '../mappers/settings.mapper';

const DEFAULT_SETTINGS_ID = 'default-settings';

@Injectable()
export class TypeOrmSettingsRepository implements SettingsRepository {
  constructor(
    @InjectRepository(SettingsOrmEntity)
    private readonly ormRepo: Repository<SettingsOrmEntity>,
  ) {}

  async get(): Promise<Settings> {
    let entity = await this.ormRepo.findOneBy({ id: DEFAULT_SETTINGS_ID });

    if (!entity) {
      // Create default settings row
      entity = new SettingsOrmEntity();
      entity.id = DEFAULT_SETTINGS_ID;
      entity.steamApiKey = null;
      entity.lastSyncAt = null;
      entity.lastSyncGameCount = null;
      entity = await this.ormRepo.save(entity);
    }

    return SettingsMapper.toDomain(entity);
  }

  async save(settings: Settings): Promise<Settings> {
    const ormEntity = SettingsMapper.toOrm(settings);
    const saved = await this.ormRepo.save(ormEntity);
    return SettingsMapper.toDomain(saved);
  }
}
