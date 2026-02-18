import { Game } from '../../../domain/entities/game.entity';
import { GameRepository } from '../../../domain/repositories/game.repository';
import { SettingsRepository } from '../../../domain/repositories/settings.repository';
import { Settings } from '../../../domain/entities/settings.entity';
import { SteamApiPort } from '../../ports/steam-api.port';
import { v4 as uuidv4 } from 'uuid';

export interface SyncResult {
  added: number;
  updated: number;
  total: number;
}

export class SyncSteamLibraryUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly settingsRepository: SettingsRepository,
    private readonly steamApi: SteamApiPort,
  ) {}

  async execute(): Promise<SyncResult> {
    const settings = await this.settingsRepository.get();
    if (!settings.isConfigured()) {
      throw new Error(
        'Steam API is not configured. Please set your API Key and Steam ID in Settings.',
      );
    }

    const steamGames = await this.steamApi.getOwnedGames(
      settings.steamApiKey!,
      settings.steamId!,
    );

    let added = 0;
    let updated = 0;
    const now = new Date();

    for (const steamGame of steamGames) {
      const existing = await this.gameRepository.findBySteamAppId(
        steamGame.appid,
      );

      const headerImageUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${steamGame.appid}/header.jpg`;
      const storeUrl = `https://store.steampowered.com/app/${steamGame.appid}`;
      const iconUrl = steamGame.img_icon_url
        ? `https://media.steampowered.com/steamcommunity/public/images/apps/${steamGame.appid}/${steamGame.img_icon_url}.jpg`
        : null;

      if (existing) {
        const updatedGame = new Game(
          existing.id,
          existing.steamAppId,
          steamGame.name,
          headerImageUrl,
          storeUrl,
          steamGame.playtime_forever,
          steamGame.playtime_2weeks ?? null,
          iconUrl,
          now,
          existing.createdAt,
          now,
        );
        await this.gameRepository.save(updatedGame);
        updated++;
      } else {
        const newGame = new Game(
          uuidv4(),
          steamGame.appid,
          steamGame.name,
          headerImageUrl,
          storeUrl,
          steamGame.playtime_forever,
          steamGame.playtime_2weeks ?? null,
          iconUrl,
          now,
          now,
          now,
        );
        await this.gameRepository.save(newGame);
        added++;
      }
    }

    // Update sync metadata in settings
    const updatedSettings = new Settings(
      settings.id,
      settings.steamApiKey,
      settings.steamId,
      now,
      steamGames.length,
    );
    await this.settingsRepository.save(updatedSettings);

    return { added, updated, total: steamGames.length };
  }
}
