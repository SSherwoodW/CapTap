import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import PlayerCard from './PlayerCard';
import { BrowserRouter as Router } from 'react-router-dom';

describe('PlayerCard', () => {
    it('renders player name correctly', () => {
        const playerName = 'LeBron James';
        const playerId = 23;

        render(
            <Router>
                <PlayerCard name={playerName} id={playerId} />
            </Router>
        );

        expect(screen.getByText(playerName)).toBeInTheDocument();
    });

    it('links to the correct player details page', () => {
        const playerName = 'LeBron James';
        const playerId = 23;

        render(
            <Router>
                <PlayerCard name={playerName} id={playerId} />
            </Router>
        );

        const playerLink = screen.getByRole('link');
        expect(playerLink).toHaveAttribute('href', `/players/${playerId}`);
    });
});
