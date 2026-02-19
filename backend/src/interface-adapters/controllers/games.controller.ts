import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { GetAllGamesUseCase } from '../../application/use-cases/games/get-all-games.use-case';
import { GetGameByIdUseCase } from '../../application/use-cases/games/get-game-by-id.use-case';
import { GamePresenter } from '../presenters/game.presenter';
import type { AuthenticatedRequest } from '../../shared/authenticated-request';

@Controller('api/games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(
    private readonly getAllGames: GetAllGamesUseCase,
    private readonly getGameById: GetGameByIdUseCase,
  ) {}

  @Get()
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    const games = await this.getAllGames.execute(req.user.id, {
      search,
      sort,
      order,
    });
    return games.map((g) => GamePresenter.toResponse(g));
  }

  @Get(':id')
  async findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    try {
      const game = await this.getGameById.execute(req.user.id, id);
      return GamePresenter.toResponse(game);
    } catch {
      throw new NotFoundException(`Game with id ${id} not found`);
    }
  }
}
