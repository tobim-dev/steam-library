export interface DiaryEntry {
  id: string;
  gameId: string | null;
  title: string;
  content: string;
  playDate: string;
  hoursPlayed: number | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}
