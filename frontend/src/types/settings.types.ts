export interface Settings {
  steamApiKey: string | null;
  steamApiKeySet: boolean;
  lastSyncAt: string | null;
  lastSyncGameCount: number | null;
  isConfigured: boolean;
}
