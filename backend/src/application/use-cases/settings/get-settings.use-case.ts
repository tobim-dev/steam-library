import { Settings } from '../../../domain/entities/settings.entity';
import { SettingsRepository } from '../../../domain/repositories/settings.repository';

export class GetSettingsUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async execute(): Promise<Settings> {
    return this.settingsRepository.get();
  }
}
