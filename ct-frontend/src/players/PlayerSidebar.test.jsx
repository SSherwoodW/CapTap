import React from 'react';
import { render } from '@testing-library/react';
import PlayerSidebar from './PlayerSidebar';
import { MemoryRouter } from 'react-router-dom';

describe('PlayerSidebar component', () => {
  const players = [
    { id: 1, full_name: 'Player 1' },
    { id: 2, full_name: 'Player 2' },
    { id: 3, full_name: 'Player 3' },
  ];
  const teamCode = 'team-code';
  const playerId = 1;

  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <PlayerSidebar players={players} teamCode={teamCode} playerId={playerId} />
      </MemoryRouter>
    );
  });

  it('should match the snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <PlayerSidebar players={players} teamCode={teamCode} playerId={playerId} />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the correct number of players', () => {
    const { getAllByRole } = render(
      <MemoryRouter>
        <PlayerSidebar players={players} teamCode={teamCode} playerId={playerId} />
      </MemoryRouter>
    );
    const playerElements = getAllByRole('link');
    expect(playerElements).toHaveLength(players.length);
  });

  it('should render the player names', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PlayerSidebar players={players} teamCode={teamCode} playerId={playerId} />
      </MemoryRouter>
    );
    players.forEach((player) => {
      const playerElement = getByText(player.full_name);
      expect(playerElement).toBeInTheDocument();
    });
  });
});
