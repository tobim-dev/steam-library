export class Note {
  constructor(
    public readonly id: string,
    public readonly gameId: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
