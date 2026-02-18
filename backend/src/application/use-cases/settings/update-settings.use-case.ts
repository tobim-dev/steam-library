import { Settings } from '../../../domain/entities/settings.entity';
import { SettingsRepository } from '../../../domain/repositories/settings.repository';

export interface UpdateSettingsInput {
  steamApiKey?: string;
  steamId?: string;
}

export class UpdateSettingsUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async execute(input: UpdateSettingsInput): Promise<Settings> {
    const existing = await this.settingsRepository.get();

    const updated = new Settings(
      existing.id,
      input.steamApiKey !== undefined ? input.steamApiKey : existing.steamApiKey,
      input.steamId !== undefined ? input.steamId : existing.steamId,
      existing.lastSyncAt,
      existing.lastSyncGameCount,
    );
    return this.settingsRepository.save(updated);
  }
}
