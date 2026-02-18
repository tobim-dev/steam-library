import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteOrmEntity } from '../persistence/typeorm/entities/note.orm-entity';
import { TypeOrmNoteRepository } from '../persistence/typeorm/repositories/typeorm-note.repository';
import { TypeOrmGameRepository } from '../persistence/typeorm/repositories/typeorm-game.repository';
import { CreateNoteUseCase } from '../../application/use-cases/notes/create-note.use-case';
import { UpdateNoteUseCase } from '../../application/use-cases/notes/update-note.use-case';
import { DeleteNoteUseCase } from '../../application/use-cases/notes/delete-note.use-case';
import { GetNotesForGameUseCase } from '../../application/use-cases/notes/get-notes-for-game.use-case';
import { NotesController } from '../../interface-adapters/controllers/notes.controller';
import { NOTE_REPOSITORY, GAME_REPOSITORY } from '../../shared/constants';
import { GamesModule } from './games.module';

@Module({
  imports: [TypeOrmModule.forFeature([NoteOrmEntity]), GamesModule],
  controllers: [NotesController],
  providers: [
    {
      provide: NOTE_REPOSITORY,
      useClass: TypeOrmNoteRepository,
    },
    {
      provide: CreateNoteUseCase,
      useFactory: (noteRepo: TypeOrmNoteRepository, gameRepo: TypeOrmGameRepository) =>
        new CreateNoteUseCase(noteRepo, gameRepo),
      inject: [NOTE_REPOSITORY, GAME_REPOSITORY],
    },
    {
      provide: UpdateNoteUseCase,
      useFactory: (repo: TypeOrmNoteRepository) => new UpdateNoteUseCase(repo),
      inject: [NOTE_REPOSITORY],
    },
    {
      provide: DeleteNoteUseCase,
      useFactory: (repo: TypeOrmNoteRepository) => new DeleteNoteUseCase(repo),
      inject: [NOTE_REPOSITORY],
    },
    {
      provide: GetNotesForGameUseCase,
      useFactory: (repo: TypeOrmNoteRepository) =>
        new GetNotesForGameUseCase(repo),
      inject: [NOTE_REPOSITORY],
    },
  ],
})
export class NotesModule {}
