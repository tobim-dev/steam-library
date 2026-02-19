import { Settings } from './settings.entity';

describe('Settings Entity', () => {
  it('should be configured when API key is set', () => {
    const settings = new Settings('id', 'APIKEY123', null, null);
    expect(settings.isApiKeyConfigured()).toBe(true);
  });

  it('should not be configured when API key is missing', () => {
    const settings = new Settings('id', null, null, null);
    expect(settings.isApiKeyConfigured()).toBe(false);
  });

  it('should not be configured when API key is empty string', () => {
    const settings = new Settings('id', '', null, null);
    expect(settings.isApiKeyConfigured()).toBe(false);
  });
});
