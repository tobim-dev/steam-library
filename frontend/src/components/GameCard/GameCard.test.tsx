import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GameCard } from './GameCard';

const mockGame = {
  id: '1',
  steamAppId: 440,
  name: 'Team Fortress 2',
  headerImageUrl: 'https://example.com/header.jpg',
  storeUrl: 'https://store.steampowered.com/app/440',
  playtimeForeverMinutes: 150,
  playtimeRecentMinutes: null,
  playtimeFormatted: '2h 30m',
  hasBeenPlayed: true,
  iconUrl: null,
  lastSyncedAt: '2024-01-01T00:00:00.000Z',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('GameCard', () => {
  it('should render game name', () => {
    render(
      <MemoryRouter>
        <GameCard game={mockGame} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Team Fortress 2')).toBeInTheDocument();
  });

  it('should render playtime', () => {
    render(
      <MemoryRouter>
        <GameCard game={mockGame} />
      </MemoryRouter>,
    );
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
  });

  it('should show "Gespielt" badge for played games', () => {
    render(
      <MemoryRouter>
        <GameCard game={mockGame} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Gespielt')).toBeInTheDocument();
  });

  it('should show "Neu" badge for unplayed games', () => {
    render(
      <MemoryRouter>
        <GameCard game={{ ...mockGame, hasBeenPlayed: false }} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Neu')).toBeInTheDocument();
  });
});
