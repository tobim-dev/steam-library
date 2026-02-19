import {
  Controller,
  Get,
  Put,
  Body,
  Request,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { GetSettingsUseCase } from '../../application/use-cases/settings/get-settings.use-case';
import { UpdateSettingsUseCase } from '../../application/use-cases/settings/update-settings.use-case';
import { UpdateSettingsDto } from '../dto/update-settings.dto';
import type { AuthenticatedRequest } from '../../shared/authenticated-request';

@Controller('api/settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(
    private readonly getSettings: GetSettingsUseCase,
    private readonly updateSettings: UpdateSettingsUseCase,
  ) {}

  @Get()
  async findOne(@Request() req: AuthenticatedRequest) {
    const settings = await this.getSettings.execute();
    const isAdmin = req.user.role === 'admin';

    return {
      steamApiKeySet:
        settings.steamApiKey !== null && settings.steamApiKey.length > 0,
      steamApiKey:
        isAdmin && settings.steamApiKey
          ? '••••••••' + settings.steamApiKey.slice(-4)
          : null,
      lastSyncAt: settings.lastSyncAt?.toISOString() ?? null,
      lastSyncGameCount: settings.lastSyncGameCount,
      isConfigured: settings.isApiKeyConfigured(),
    };
  }

  @Put()
  async update(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateSettingsDto,
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Nur Admins dürfen Einstellungen ändern');
    }

    const settings = await this.updateSettings.execute({
      steamApiKey: dto.steamApiKey,
    });

    return {
      steamApiKeySet:
        settings.steamApiKey !== null && settings.steamApiKey.length > 0,
      steamApiKey: settings.steamApiKey
        ? '••••••••' + settings.steamApiKey.slice(-4)
        : null,
      lastSyncAt: settings.lastSyncAt?.toISOString() ?? null,
      lastSyncGameCount: settings.lastSyncGameCount,
      isConfigured: settings.isApiKeyConfigured(),
    };
  }
}
