export type UserRole = 'admin' | 'user';

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly displayName: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public readonly steamId: string | null,
    public readonly isActive: boolean,
    public readonly mustChangePassword: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  get isConfiguredForSync(): boolean {
    return this.steamId !== null && this.steamId.length > 0;
  }
}
