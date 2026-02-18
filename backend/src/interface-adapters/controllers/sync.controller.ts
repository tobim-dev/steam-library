import { Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { SyncSteamLibraryUseCase } from '../../application/use-cases/games/sync-steam-library.use-case';

@Controller('api/sync')
export class SyncController {
  constructor(private readonly syncSteamLibrary: SyncSteamLibraryUseCase) {}

  @Post('steam')
  async sync() {
    try {
      const result = await this.syncSteamLibrary.execute();
      return {
        success: true,
        message: `Sync complete: ${result.added} added, ${result.updated} updated, ${result.total} total games.`,
        ...result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error instanceof Error ? error.message : 'Sync failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
