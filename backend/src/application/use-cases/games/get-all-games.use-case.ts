import { Game } from '../../../domain/entities/game.entity';
import { GameRepository } from '../../../domain/repositories/game.repository';

export class GetAllGamesUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(
    userId: string,
    options?: {
      search?: string;
      sort?: string;
      order?: 'asc' | 'desc';
    },
  ): Promise<Game[]> {
    return this.gameRepository.findAll(userId, options);
  }
}
