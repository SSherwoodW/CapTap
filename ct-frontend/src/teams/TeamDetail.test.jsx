import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it } from 'vitest';
import TeamDetail from './TeamDetail';
import CapTapApi from '../../../api';

vi.mock('react-router-dom', async () => {
    const mod = await vi.importActual('react-router-dom');
    return {
        ...mod,
        useParams: () => ({
            code: "TST"
        })
    }
})
// Mock the CapTapApi module
const mockTeamData = {
    name: 'Team 1',
    players: [
        { id: 1, full_name: 'Player 1' },
        { id: 2, full_name: 'Player 2' }
    ]
};
vi.mock('../../../api');

describe('TeamDetail component', () => {
    it('should render without crashing', () => {
        render(
            <MemoryRouter>
                <TeamDetail />
            </MemoryRouter>
        );
    });

    it('should match the snapshot', () => {
        const { container } = render(
            <MemoryRouter>
                <TeamDetail />
            </MemoryRouter>
        );
        expect(container).toMatchSnapshot();
    });

    it('should render loading spinner initially', () => {
        render(
            <MemoryRouter>
                <TeamDetail />
            </MemoryRouter>
        );
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should render team logo and roster after loading', async () => {
        vi.spyOn(CapTapApi, 'getTeam').mockResolvedValueOnce(
            {
                name: 'Team 1',
                players: [
                    { id: 1, full_name: 'Player 1' },
                    { id: 2, full_name: 'Player 2' }
                ]
            }
        );
        render(
            <MemoryRouter>
                <TeamDetail />
            </MemoryRouter>
        );

        await screen.findByText('Team 1 Logo');
        expect(screen.getByText('Team 1 Roster')).toBeInTheDocument();

        expect(screen.getByText('Player 1')).toBeInTheDocument();
        expect(screen.getByText('Player 2')).toBeInTheDocument();
    });
});
