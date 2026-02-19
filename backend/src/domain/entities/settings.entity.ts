export class Settings {
  constructor(
    public readonly id: string,
    public readonly steamApiKey: string | null,
    public readonly lastSyncAt: Date | null,
    public readonly lastSyncGameCount: number | null,
  ) {}

  isApiKeyConfigured(): boolean {
    return this.steamApiKey !== null && this.steamApiKey.length > 0;
  }
}
