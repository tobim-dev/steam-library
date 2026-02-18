export class Settings {
  constructor(
    public readonly id: string,
    public readonly steamApiKey: string | null,
    public readonly steamId: string | null,
    public readonly lastSyncAt: Date | null,
    public readonly lastSyncGameCount: number | null,
  ) {}

  isConfigured(): boolean {
    return (
      this.steamApiKey !== null &&
      this.steamApiKey.length > 0 &&
      this.steamId !== null &&
      this.steamId.length > 0
    );
  }
}
