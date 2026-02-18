import { Injectable } from '@nestjs/common';
import { SteamApiPort, SteamOwnedGame } from '../../../application/ports/steam-api.port';
import { SteamGetOwnedGamesResponse } from './steam-api.types';

@Injectable()
export class SteamApiClient implements SteamApiPort {
  private readonly baseUrl = 'https://api.steampowered.com';

  async getOwnedGames(
    apiKey: string,
    steamId: string,
  ): Promise<SteamOwnedGame[]> {
    const url = `${this.baseUrl}/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Steam API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: SteamGetOwnedGamesResponse = await response.json();

    if (!data.response || !data.response.games) {
      return [];
    }

    return data.response.games.map((game) => ({
      appid: game.appid,
      name: game.name,
      playtime_forever: game.playtime_forever,
      playtime_2weeks: game.playtime_2weeks,
      img_icon_url: game.img_icon_url,
      img_logo_url: game.img_logo_url,
    }));
  }
}
