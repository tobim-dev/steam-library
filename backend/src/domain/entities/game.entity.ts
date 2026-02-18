export class Game {
  constructor(
    public readonly id: string,
    public readonly steamAppId: number,
    public readonly name: string,
    public readonly headerImageUrl: string,
    public readonly storeUrl: string,
    public readonly playtimeForeverMinutes: number,
    public readonly playtimeRecentMinutes: number | null,
    public readonly iconUrl: string | null,
    public readonly lastSyncedAt: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get playtimeFormatted(): string {
    const hours = Math.floor(this.playtimeForeverMinutes / 60);
    const minutes = this.playtimeForeverMinutes % 60;
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  }

  get hasBeenPlayed(): boolean {
    return this.playtimeForeverMinutes > 0;
  }
}
