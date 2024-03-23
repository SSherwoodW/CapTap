import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, it, vi, fetchMock } from 'vitest';
import CapTapApi from "../../../api";
import PlayersList from './PlayersList';

vi.mock("../../../api");
const playersData = {
            id: '1',
            fullname: 'LeBron James',
            name: 'Los Angeles Lakers' 
        };
vi.spyOn(CapTapApi, 'getPlayers').mockResolvedValueOnce(playersData);
        
describe('PlayersList component', () => {
    it('should render without crashing', () => {
        render(
        <MemoryRouter>
            <PlayersList />
        </MemoryRouter>
        );
    });

    it('should match the snapshot', () => {
        const { container } = render(
        <MemoryRouter>
            <PlayersList />
        </MemoryRouter>
        );
        expect(container).toMatchSnapshot();
        });

    it('should render loading spinner when players are null', () => {
        const { getByTestId } = render(
        <MemoryRouter>
            <PlayersList />
        </MemoryRouter>
        );
        expect(getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should render players when players are not null', async () => {
        vi.spyOn(CapTapApi, 'getPlayers').mockResolvedValueOnce([
                { id: 1, name: 'Player 1' },
                { id: 2, name: 'Player 2' },
            ]);

        const { findByText } = render(
        <MemoryRouter>
            <PlayersList />
        </MemoryRouter>
        );
        screen.debug();

        // Check if loading spinner disappears and players are rendered
        expect(await findByText('Player 1')).toBeInTheDocument();
        expect(await findByText('Player 2')).toBeInTheDocument();
    });

    // 
});
