import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeAll, beforeEach, describe, it, vi } from 'vitest';
import NavBarSearch from './PlayersSearch';
import CapTapApi from '../../../api';

vi.mock("../../../api");

describe('NavBarSearch component', () => {
    // beforeAll(() => {
    //     vi.spyOn(CapTapApi, 'getPlayers').mockResolvedValueOnce([
    //             { id: 1, name: 'Player 1' },
    //             { id: 2, name: 'Player 2' },
    //         ]);
    // })
    // const players = [
    //     { id: 1, name: 'Player 1' },
    //     { id: 2, name: 'Player 2' },
    // ];

    // const teams = [
    //     { id: 1, name: 'Team 1' },
    //     { id: 2, name: 'Team 2' },
    // ];

    // it('should render without crashing', () => {
    //     render(<NavBarSearch searchType="players" />);
    //     screen.debug();
    //     // expect(screen.getByRole('combobox')).toBeInTheDocument();
    // });

    // it('should match the snapshot', () => {
    //     const { container } = render(<NavBarSearch searchType="players" />);
    //     expect(container.innerHTML).toMatchSnapshot();
    // });

    it('should render players list when searchType is "players"', () => {
        render(<NavBarSearch searchType="players" />);
        screen.debug();
        vi.spyOn(CapTapApi, 'getPlayers').mockResolvedValueOnce([
                        { id: 1, name: 'Player 1' },
                        { id: 2, name: 'Player 2' },
                    ]);

        // Verify players are rendered
        expect(screen.getByText('Player 1')).toBeInTheDocument();
        expect(screen.getByText('Player 2')).toBeInTheDocument();
    });

    // it('should render teams list when searchType is "teams"', () => {
    //     render(<NavBarSearch searchType="teams" />);
    //     // Mocking API response

    //     // Verify teams are rendered
    //     expect(screen.getByText('Team 1')).toBeInTheDocument();
    //     expect(screen.getByText('Team 2')).toBeInTheDocument();
    // });

    // it('should display "No players found" message when no players match the query', async () => {
    //     render(<NavBarSearch searchType="players" />);
    //     // Mocking empty API response

    //     // Wait for the message to appear
    //     const noResultsMessage = await screen.findByText('No players found.');
    //     expect(noResultsMessage).toBeInTheDocument();
    // });

    // it('should reset query after an item is selected', async () => {
    //     render(<NavBarSearch searchType="players" />);
    //     // Mocking API response

    //     // Click on the first player
    //     fireEvent.click(screen.getByText('Player 1'));
    //     // Verify that query is reset
    //     expect(screen.getByRole('combobox')).toHaveValue('');
    // });
});