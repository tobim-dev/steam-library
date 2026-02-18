export interface SteamOwnedGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  img_icon_url?: string;
  img_logo_url?: string;
}

export interface SteamApiPort {
  getOwnedGames(
    apiKey: string,
    steamId: string,
  ): Promise<SteamOwnedGame[]>;
}
