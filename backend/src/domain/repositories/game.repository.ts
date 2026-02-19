import { Game } from '../entities/game.entity';

export interface GameRepository {
  findAll(
    userId: string,
    options?: {
      search?: string;
      sort?: string;
      order?: 'asc' | 'desc';
    },
  ): Promise<Game[]>;
  findById(id: string): Promise<Game | null>;
  findBySteamAppId(steamAppId: number, userId: string): Promise<Game | null>;
  save(game: Game): Promise<Game>;
  saveMany(games: Game[]): Promise<Game[]>;
  count(userId?: string): Promise<number>;
}
