import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameOrmEntity } from '../persistence/typeorm/entities/game.orm-entity';
import { SettingsOrmEntity } from '../persistence/typeorm/entities/settings.orm-entity';
import { TypeOrmGameRepository } from '../persistence/typeorm/repositories/typeorm-game.repository';
import { TypeOrmSettingsRepository } from '../persistence/typeorm/repositories/typeorm-settings.repository';
import { SteamApiClient } from '../external/steam/steam-api.client';
import { SyncSteamLibraryUseCase } from '../../application/use-cases/games/sync-steam-library.use-case';
import { SyncController } from '../../interface-adapters/controllers/sync.controller';
import {
  GAME_REPOSITORY,
  SETTINGS_REPOSITORY,
  STEAM_API_PORT,
} from '../../shared/constants';
import { GamesModule } from './games.module';
import { SettingsModule } from './settings.module';

@Module({
  imports: [GamesModule, SettingsModule],
  controllers: [SyncController],
  providers: [
    {
      provide: STEAM_API_PORT,
      useClass: SteamApiClient,
    },
    {
      provide: SyncSteamLibraryUseCase,
      useFactory: (
        gameRepo: TypeOrmGameRepository,
        settingsRepo: TypeOrmSettingsRepository,
        steamApi: SteamApiClient,
      ) => new SyncSteamLibraryUseCase(gameRepo, settingsRepo, steamApi),
      inject: [GAME_REPOSITORY, SETTINGS_REPOSITORY, STEAM_API_PORT],
    },
  ],
})
export class SteamModule {}
