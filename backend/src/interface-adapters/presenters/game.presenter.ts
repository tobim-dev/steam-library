import { Game } from '../../domain/entities/game.entity';

export class GamePresenter {
  static toResponse(game: Game) {
    return {
      id: game.id,
      steamAppId: game.steamAppId,
      name: game.name,
      headerImageUrl: game.headerImageUrl,
      storeUrl: game.storeUrl,
      playtimeForeverMinutes: game.playtimeForeverMinutes,
      playtimeRecentMinutes: game.playtimeRecentMinutes,
      playtimeFormatted: game.playtimeFormatted,
      hasBeenPlayed: game.hasBeenPlayed,
      iconUrl: game.iconUrl,
      lastSyncedAt: game.lastSyncedAt.toISOString(),
      createdAt: game.createdAt.toISOString(),
      updatedAt: game.updatedAt.toISOString(),
    };
  }
}
