import { Settings } from './settings.entity';

describe('Settings Entity', () => {
  it('should be configured when both API key and Steam ID are set', () => {
    const settings = new Settings(
      'id',
      'APIKEY123',
      '76561198012345678',
      null,
      null,
    );
    expect(settings.isConfigured()).toBe(true);
  });

  it('should not be configured when API key is missing', () => {
    const settings = new Settings('id', null, '76561198012345678', null, null);
    expect(settings.isConfigured()).toBe(false);
  });

  it('should not be configured when Steam ID is missing', () => {
    const settings = new Settings('id', 'APIKEY123', null, null, null);
    expect(settings.isConfigured()).toBe(false);
  });

  it('should not be configured when API key is empty string', () => {
    const settings = new Settings('id', '', '76561198012345678', null, null);
    expect(settings.isConfigured()).toBe(false);
  });

  it('should not be configured when both are missing', () => {
    const settings = new Settings('id', null, null, null, null);
    expect(settings.isConfigured()).toBe(false);
  });
});
