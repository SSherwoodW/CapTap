import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, it, vi } from 'vitest';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import PlayerDetail from './PlayerDetail';
import CapTapApi from "../../../api";
import getAverages from '../helpers/getAverages';

vi.mock("../../../api");
vi.mock('react-router-dom', async () => {
    const mod = await vi.importActual('react-router-dom');
    return {
        ...mod,
        useParams: () => ({
            id: 1
        })
    }
});
vi.mock('../helpers/getAverages');
getAverages.mockReturnValue({
        averageMinutes: 5.5,
        averagePoints: 5.5,
        averageAssists: 5.5,
        averageRebounds: 5.5,
        averageTurnovers: 5.5,
        averageSteals: 5.5,
        averageBlocks: 5.5,
        averageThreePointsMade: 5.5,
    })

describe('PlayerDetail', () => {
    beforeEach(() => {
        const mockFetchedTeam = { id: 1, code: "PHX" }
        vi.spyOn(CapTapApi, 'findTeam').mockReturnValue(mockFetchedTeam);
    })
    it('renders player details after fetching player data', async () => {
        const playerData = {
            id: '1',
            fullname: 'LeBron James',
            name: 'Los Angeles Lakers',
            boxscores: [{}, {}], 
            teammates: [], 
        };
        vi.spyOn(CapTapApi, 'getPlayer').mockResolvedValueOnce(playerData);

        render(
            <MemoryRouter initialEntries={['/players/1']}>
                <PlayerDetail />
            </MemoryRouter>
        );

        expect(await screen.findByText(playerData.fullname)).toBeInTheDocument();
        expect(screen.getByText(playerData.name)).toBeInTheDocument();
    });

    it('renders team logo', async () => {
        const playerData = {
            id: '1',
            fullname: 'LeBron James',
            name: 'Phoenix Suns',
            boxscores: [],
            teammates: [],
        };
        vi.spyOn(CapTapApi, 'getPlayer').mockResolvedValueOnce(playerData);

        render(
            <MemoryRouter initialEntries={['/players/1']}>
                <PlayerDetail />
            </MemoryRouter>
        );

        const logo = await screen.findByAltText(`${playerData.name} Logo`);
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', `../nba-logos/${playerData.name}.png`);
    });
});
