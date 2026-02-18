import { DiaryEntry } from './diary-entry.entity';

describe('DiaryEntry Entity', () => {
  it('should detect rated entries', () => {
    const entry = new DiaryEntry(
      'id',
      'game-1',
      'Title',
      'Content',
      new Date(),
      2,
      4,
      new Date(),
      new Date(),
    );
    expect(entry.isRated).toBe(true);
  });

  it('should detect unrated entries (null)', () => {
    const entry = new DiaryEntry(
      'id',
      'game-1',
      'Title',
      'Content',
      new Date(),
      2,
      null,
      new Date(),
      new Date(),
    );
    expect(entry.isRated).toBe(false);
  });

  it('should reject invalid rating (0)', () => {
    const entry = new DiaryEntry(
      'id',
      'game-1',
      'Title',
      'Content',
      new Date(),
      2,
      0,
      new Date(),
      new Date(),
    );
    expect(entry.isRated).toBe(false);
  });

  it('should allow game-less entries', () => {
    const entry = new DiaryEntry(
      'id',
      null,
      'General',
      'Content',
      new Date(),
      null,
      null,
      new Date(),
      new Date(),
    );
    expect(entry.gameId).toBeNull();
  });
});
