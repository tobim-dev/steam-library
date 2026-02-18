export interface Settings {
  steamApiKey: string | null;
  steamApiKeySet: boolean;
  steamId: string | null;
  lastSyncAt: string | null;
  lastSyncGameCount: number | null;
  isConfigured: boolean;
}
