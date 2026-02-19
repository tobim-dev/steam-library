import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmGameRepository } from '../persistence/typeorm/repositories/typeorm-game.repository';
import { TypeOrmSettingsRepository } from '../persistence/typeorm/repositories/typeorm-settings.repository';
import { TypeOrmUserRepository } from '../persistence/typeorm/repositories/typeorm-user.repository';
import { SteamApiClient } from '../external/steam/steam-api.client';
import { SyncSteamLibraryUseCase } from '../../application/use-cases/games/sync-steam-library.use-case';
import { SyncAllUsersUseCase } from '../../application/use-cases/games/sync-all-users.use-case';
import { SyncController } from '../../interface-adapters/controllers/sync.controller';
import {
  GAME_REPOSITORY,
  SETTINGS_REPOSITORY,
  STEAM_API_PORT,
  USER_REPOSITORY,
} from '../../shared/constants';
import { GamesModule } from './games.module';
import { SettingsModule } from './settings.module';
import { UsersModule } from './users.module';

@Module({
  imports: [GamesModule, SettingsModule, forwardRef(() => UsersModule)],
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
        userRepo: TypeOrmUserRepository,
        steamApi: SteamApiClient,
      ) =>
        new SyncSteamLibraryUseCase(gameRepo, settingsRepo, userRepo, steamApi),
      inject: [
        GAME_REPOSITORY,
        SETTINGS_REPOSITORY,
        USER_REPOSITORY,
        STEAM_API_PORT,
      ],
    },
    {
      provide: SyncAllUsersUseCase,
      useFactory: (
        userRepo: TypeOrmUserRepository,
        syncSteamLibrary: SyncSteamLibraryUseCase,
      ) => new SyncAllUsersUseCase(userRepo, syncSteamLibrary),
      inject: [USER_REPOSITORY, SyncSteamLibraryUseCase],
    },
  ],
  exports: [SyncAllUsersUseCase],
})
export class SteamModule {}
