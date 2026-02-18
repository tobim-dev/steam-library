export interface Game {
  id: string;
  steamAppId: number;
  name: string;
  headerImageUrl: string;
  storeUrl: string;
  playtimeForeverMinutes: number;
  playtimeRecentMinutes: number | null;
  playtimeFormatted: string;
  hasBeenPlayed: boolean;
  iconUrl: string | null;
  lastSyncedAt: string;
  createdAt: string;
  updatedAt: string;
}
