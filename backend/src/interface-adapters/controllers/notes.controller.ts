import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { CreateNoteUseCase } from '../../application/use-cases/notes/create-note.use-case';
import { UpdateNoteUseCase } from '../../application/use-cases/notes/update-note.use-case';
import { DeleteNoteUseCase } from '../../application/use-cases/notes/delete-note.use-case';
import { GetNotesForGameUseCase } from '../../application/use-cases/notes/get-notes-for-game.use-case';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { NotePresenter } from '../presenters/note.presenter';
import type { AuthenticatedRequest } from '../../shared/authenticated-request';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(
    private readonly createNote: CreateNoteUseCase,
    private readonly updateNote: UpdateNoteUseCase,
    private readonly deleteNote: DeleteNoteUseCase,
    private readonly getNotesForGame: GetNotesForGameUseCase,
  ) {}

  @Get('games/:gameId/notes')
  async findByGame(
    @Request() req: AuthenticatedRequest,
    @Param('gameId') gameId: string,
  ) {
    const notes = await this.getNotesForGame.execute(req.user.id, gameId);
    return notes.map((n) => NotePresenter.toResponse(n));
  }

  @Post('games/:gameId/notes')
  async create(
    @Request() req: AuthenticatedRequest,
    @Param('gameId') gameId: string,
    @Body() dto: CreateNoteDto,
  ) {
    try {
      const note = await this.createNote.execute(
        req.user.id,
        gameId,
        dto.content,
      );
      return NotePresenter.toResponse(note);
    } catch {
      throw new NotFoundException(`Game with id ${gameId} not found`);
    }
  }

  @Put('notes/:id')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    try {
      const note = await this.updateNote.execute(req.user.id, id, dto.content);
      return NotePresenter.toResponse(note);
    } catch {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
  }

  @Delete('notes/:id')
  async remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    try {
      await this.deleteNote.execute(req.user.id, id);
      return { success: true };
    } catch {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
  }
}
