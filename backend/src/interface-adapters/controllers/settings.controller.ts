import { Controller, Get, Put, Body } from '@nestjs/common';
import { GetSettingsUseCase } from '../../application/use-cases/settings/get-settings.use-case';
import { UpdateSettingsUseCase } from '../../application/use-cases/settings/update-settings.use-case';
import { UpdateSettingsDto } from '../dto/update-settings.dto';

@Controller('api/settings')
export class SettingsController {
  constructor(
    private readonly getSettings: GetSettingsUseCase,
    private readonly updateSettings: UpdateSettingsUseCase,
  ) {}

  @Get()
  async get() {
    const settings = await this.getSettings.execute();
    return {
      steamApiKey: settings.steamApiKey
        ? '••••••••' + settings.steamApiKey.slice(-4)
        : null,
      steamApiKeySet: settings.steamApiKey !== null && settings.steamApiKey.length > 0,
      steamId: settings.steamId,
      lastSyncAt: settings.lastSyncAt?.toISOString() ?? null,
      lastSyncGameCount: settings.lastSyncGameCount,
      isConfigured: settings.isConfigured(),
    };
  }

  @Put()
  async update(@Body() dto: UpdateSettingsDto) {
    const settings = await this.updateSettings.execute(dto);
    return {
      steamApiKey: settings.steamApiKey
        ? '••••••••' + settings.steamApiKey.slice(-4)
        : null,
      steamApiKeySet: settings.steamApiKey !== null && settings.steamApiKey.length > 0,
      steamId: settings.steamId,
      lastSyncAt: settings.lastSyncAt?.toISOString() ?? null,
      lastSyncGameCount: settings.lastSyncGameCount,
      isConfigured: settings.isConfigured(),
    };
  }
}
