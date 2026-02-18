import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntryOrmEntity } from '../persistence/typeorm/entities/diary-entry.orm-entity';
import { TypeOrmDiaryEntryRepository } from '../persistence/typeorm/repositories/typeorm-diary-entry.repository';
import { TypeOrmGameRepository } from '../persistence/typeorm/repositories/typeorm-game.repository';
import { CreateDiaryEntryUseCase } from '../../application/use-cases/diary/create-diary-entry.use-case';
import { UpdateDiaryEntryUseCase } from '../../application/use-cases/diary/update-diary-entry.use-case';
import { DeleteDiaryEntryUseCase } from '../../application/use-cases/diary/delete-diary-entry.use-case';
import { GetDiaryEntriesUseCase } from '../../application/use-cases/diary/get-diary-entries.use-case';
import { GetDiaryEntriesForGameUseCase } from '../../application/use-cases/diary/get-diary-entries-for-game.use-case';
import { DiaryController } from '../../interface-adapters/controllers/diary.controller';
import { DIARY_ENTRY_REPOSITORY, GAME_REPOSITORY } from '../../shared/constants';
import { GamesModule } from './games.module';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntryOrmEntity]), GamesModule],
  controllers: [DiaryController],
  providers: [
    {
      provide: DIARY_ENTRY_REPOSITORY,
      useClass: TypeOrmDiaryEntryRepository,
    },
    {
      provide: CreateDiaryEntryUseCase,
      useFactory: (
        diaryRepo: TypeOrmDiaryEntryRepository,
        gameRepo: TypeOrmGameRepository,
      ) => new CreateDiaryEntryUseCase(diaryRepo, gameRepo),
      inject: [DIARY_ENTRY_REPOSITORY, GAME_REPOSITORY],
    },
    {
      provide: UpdateDiaryEntryUseCase,
      useFactory: (repo: TypeOrmDiaryEntryRepository) =>
        new UpdateDiaryEntryUseCase(repo),
      inject: [DIARY_ENTRY_REPOSITORY],
    },
    {
      provide: DeleteDiaryEntryUseCase,
      useFactory: (repo: TypeOrmDiaryEntryRepository) =>
        new DeleteDiaryEntryUseCase(repo),
      inject: [DIARY_ENTRY_REPOSITORY],
    },
    {
      provide: GetDiaryEntriesUseCase,
      useFactory: (repo: TypeOrmDiaryEntryRepository) =>
        new GetDiaryEntriesUseCase(repo),
      inject: [DIARY_ENTRY_REPOSITORY],
    },
    {
      provide: GetDiaryEntriesForGameUseCase,
      useFactory: (repo: TypeOrmDiaryEntryRepository) =>
        new GetDiaryEntriesForGameUseCase(repo),
      inject: [DIARY_ENTRY_REPOSITORY],
    },
  ],
})
export class DiaryModule {}
