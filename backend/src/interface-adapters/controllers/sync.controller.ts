import {
  Controller,
  Post,
  Request,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { SyncSteamLibraryUseCase } from '../../application/use-cases/games/sync-steam-library.use-case';
import type { AuthenticatedRequest } from '../../shared/authenticated-request';

@Controller('api/sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(private readonly syncSteamLibrary: SyncSteamLibraryUseCase) {}

  @Post('steam')
  async sync(@Request() req: AuthenticatedRequest) {
    try {
      const result = await this.syncSteamLibrary.execute(req.user.id);
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
