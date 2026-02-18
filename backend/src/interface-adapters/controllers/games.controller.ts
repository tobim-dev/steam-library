import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { GetAllGamesUseCase } from '../../application/use-cases/games/get-all-games.use-case';
import { GetGameByIdUseCase } from '../../application/use-cases/games/get-game-by-id.use-case';
import { GamePresenter } from '../presenters/game.presenter';

@Controller('api/games')
export class GamesController {
  constructor(
    private readonly getAllGames: GetAllGamesUseCase,
    private readonly getGameById: GetGameByIdUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    const games = await this.getAllGames.execute({ search, sort, order });
    return games.map(GamePresenter.toResponse);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const game = await this.getGameById.execute(id);
      return GamePresenter.toResponse(game);
    } catch {
      throw new NotFoundException(`Game with id ${id} not found`);
    }
  }
}
