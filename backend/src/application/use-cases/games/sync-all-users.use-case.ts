import { UserRepository } from '../../../domain/repositories/user.repository';
import {
  SyncSteamLibraryUseCase,
  SyncResult,
} from './sync-steam-library.use-case';

export interface SyncAllResult {
  totalUsers: number;
  successCount: number;
  results: Array<{
    userId: string;
    username: string;
    success: boolean;
    result?: SyncResult;
    error?: string;
  }>;
}

export class SyncAllUsersUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly syncSteamLibrary: SyncSteamLibraryUseCase,
  ) {}

  async execute(): Promise<SyncAllResult> {
    const users = await this.userRepository.findAll();
    const syncableUsers = users.filter(
      (u) => u.isActive && u.isConfiguredForSync,
    );

    const results: SyncAllResult['results'] = [];

    for (const user of syncableUsers) {
      try {
        const result = await this.syncSteamLibrary.execute(user.id);
        results.push({
          userId: user.id,
          username: user.username,
          success: true,
          result,
        });
      } catch (error) {
        results.push({
          userId: user.id,
          username: user.username,
          success: false,
          error: error instanceof Error ? error.message : 'Unbekannter Fehler',
        });
      }
    }

    return {
      totalUsers: syncableUsers.length,
      successCount: results.filter((r) => r.success).length,
      results,
    };
  }
}
