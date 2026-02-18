import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameOrmEntity } from '../persistence/typeorm/entities/game.orm-entity';
import { TypeOrmGameRepository } from '../persistence/typeorm/repositories/typeorm-game.repository';
import { GetAllGamesUseCase } from '../../application/use-cases/games/get-all-games.use-case';
import { GetGameByIdUseCase } from '../../application/use-cases/games/get-game-by-id.use-case';
import { GamesController } from '../../interface-adapters/controllers/games.controller';
import { GAME_REPOSITORY } from '../../shared/constants';

@Module({
  imports: [TypeOrmModule.forFeature([GameOrmEntity])],
  controllers: [GamesController],
  providers: [
    {
      provide: GAME_REPOSITORY,
      useClass: TypeOrmGameRepository,
    },
    {
      provide: GetAllGamesUseCase,
      useFactory: (repo: TypeOrmGameRepository) =>
        new GetAllGamesUseCase(repo),
      inject: [GAME_REPOSITORY],
    },
    {
      provide: GetGameByIdUseCase,
      useFactory: (repo: TypeOrmGameRepository) =>
        new GetGameByIdUseCase(repo),
      inject: [GAME_REPOSITORY],
    },
  ],
  exports: [GAME_REPOSITORY],
})
export class GamesModule {}
