import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiaryEntryUseCase } from '../../application/use-cases/diary/create-diary-entry.use-case';
import { UpdateDiaryEntryUseCase } from '../../application/use-cases/diary/update-diary-entry.use-case';
import { DeleteDiaryEntryUseCase } from '../../application/use-cases/diary/delete-diary-entry.use-case';
import { GetDiaryEntriesUseCase } from '../../application/use-cases/diary/get-diary-entries.use-case';
import { GetDiaryEntriesForGameUseCase } from '../../application/use-cases/diary/get-diary-entries-for-game.use-case';
import { CreateDiaryEntryDto } from '../dto/create-diary-entry.dto';
import { UpdateDiaryEntryDto } from '../dto/update-diary-entry.dto';
import { DiaryEntryPresenter } from '../presenters/diary-entry.presenter';

@Controller('api')
export class DiaryController {
  constructor(
    private readonly createDiaryEntry: CreateDiaryEntryUseCase,
    private readonly updateDiaryEntry: UpdateDiaryEntryUseCase,
    private readonly deleteDiaryEntry: DeleteDiaryEntryUseCase,
    private readonly getDiaryEntries: GetDiaryEntriesUseCase,
    private readonly getDiaryEntriesForGame: GetDiaryEntriesForGameUseCase,
  ) {}

  @Get('diary')
  async findAll(
    @Query('gameId') gameId?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    const entries = await this.getDiaryEntries.execute({
      gameId,
      sort,
      order,
    });
    return entries.map((e) => DiaryEntryPresenter.toResponse(e));
  }

  @Get('games/:gameId/diary')
  async findByGame(@Param('gameId') gameId: string) {
    const entries = await this.getDiaryEntriesForGame.execute(gameId);
    return entries.map((e) => DiaryEntryPresenter.toResponse(e));
  }

  @Post('diary')
  async create(@Body() dto: CreateDiaryEntryDto) {
    try {
      const entry = await this.createDiaryEntry.execute({
        gameId: dto.gameId,
        title: dto.title,
        content: dto.content,
        playDate: new Date(dto.playDate),
        hoursPlayed: dto.hoursPlayed,
        rating: dto.rating,
      });
      return DiaryEntryPresenter.toResponse(entry);
    } catch (error) {
      throw new NotFoundException(
        error instanceof Error ? error.message : 'Failed to create entry',
      );
    }
  }

  @Put('diary/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateDiaryEntryDto) {
    try {
      const entry = await this.updateDiaryEntry.execute(id, {
        title: dto.title,
        content: dto.content,
        playDate: dto.playDate ? new Date(dto.playDate) : undefined,
        hoursPlayed: dto.hoursPlayed,
        rating: dto.rating,
      });
      return DiaryEntryPresenter.toResponse(entry);
    } catch {
      throw new NotFoundException(`Diary entry with id ${id} not found`);
    }
  }

  @Delete('diary/:id')
  async remove(@Param('id') id: string) {
    try {
      await this.deleteDiaryEntry.execute(id);
      return { success: true };
    } catch {
      throw new NotFoundException(`Diary entry with id ${id} not found`);
    }
  }
}
