import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsOrmEntity } from '../persistence/typeorm/entities/settings.orm-entity';
import { TypeOrmSettingsRepository } from '../persistence/typeorm/repositories/typeorm-settings.repository';
import { GetSettingsUseCase } from '../../application/use-cases/settings/get-settings.use-case';
import { UpdateSettingsUseCase } from '../../application/use-cases/settings/update-settings.use-case';
import { SettingsController } from '../../interface-adapters/controllers/settings.controller';
import { SETTINGS_REPOSITORY } from '../../shared/constants';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsOrmEntity])],
  controllers: [SettingsController],
  providers: [
    {
      provide: SETTINGS_REPOSITORY,
      useClass: TypeOrmSettingsRepository,
    },
    {
      provide: GetSettingsUseCase,
      useFactory: (repo: TypeOrmSettingsRepository) =>
        new GetSettingsUseCase(repo),
      inject: [SETTINGS_REPOSITORY],
    },
    {
      provide: UpdateSettingsUseCase,
      useFactory: (repo: TypeOrmSettingsRepository) =>
        new UpdateSettingsUseCase(repo),
      inject: [SETTINGS_REPOSITORY],
    },
  ],
  exports: [SETTINGS_REPOSITORY],
})
export class SettingsModule {}
