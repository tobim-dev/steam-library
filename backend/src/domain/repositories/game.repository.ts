import { Game } from '../entities/game.entity';

export interface GameRepository {
  findAll(options?: {
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<Game[]>;
  findById(id: string): Promise<Game | null>;
  findBySteamAppId(steamAppId: number): Promise<Game | null>;
  save(game: Game): Promise<Game>;
  saveMany(games: Game[]): Promise<Game[]>;
  count(): Promise<number>;
}
