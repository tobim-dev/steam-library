import { Game } from './game.entity';

describe('Game Entity', () => {
  const createGame = (playtimeMinutes: number) =>
    new Game(
      'id-1',
      440,
      'Team Fortress 2',
      'https://example.com/header.jpg',
      'https://store.steampowered.com/app/440',
      playtimeMinutes,
      null,
      null,
      new Date(),
      new Date(),
      new Date(),
    );

  it('should format playtime as hours and minutes', () => {
    const game = createGame(150);
    expect(game.playtimeFormatted).toBe('2h 30m');
  });

  it('should format zero playtime as 0m', () => {
    const game = createGame(0);
    expect(game.playtimeFormatted).toBe('0m');
  });

  it('should format minutes-only playtime', () => {
    const game = createGame(45);
    expect(game.playtimeFormatted).toBe('45m');
  });

  it('should detect played games', () => {
    expect(createGame(100).hasBeenPlayed).toBe(true);
  });

  it('should detect unplayed games', () => {
    expect(createGame(0).hasBeenPlayed).toBe(false);
  });
});
