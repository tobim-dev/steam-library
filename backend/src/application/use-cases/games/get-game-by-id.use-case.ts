import { Game } from '../../../domain/entities/game.entity';
import { GameRepository } from '../../../domain/repositories/game.repository';

export class GetGameByIdUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(userId: string, id: string): Promise<Game> {
    const game = await this.gameRepository.findById(id);
    if (!game) {
      throw new Error(`Game with id ${id} not found`);
    }
    return game;
  }
}
