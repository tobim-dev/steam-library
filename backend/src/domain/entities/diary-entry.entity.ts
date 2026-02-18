export class DiaryEntry {
  constructor(
    public readonly id: string,
    public readonly gameId: string | null,
    public readonly title: string,
    public readonly content: string,
    public readonly playDate: Date,
    public readonly hoursPlayed: number | null,
    public readonly rating: number | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get isRated(): boolean {
    return this.rating !== null && this.rating >= 1 && this.rating <= 5;
  }
}
