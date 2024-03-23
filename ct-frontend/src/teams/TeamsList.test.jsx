import React from "react";
import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { MemoryRouter } from "react-router-dom";
import CapTapApi from '../../../api';
import TeamsList from './TeamsList';

vi.mock("../../../api");

describe('TeamsList component', () => {
    it('should render without crashing', () => {
        render(
            <MemoryRouter>
                <TeamsList />
            </MemoryRouter> 
        );
    });

    it('should match snapshot', () => {
        const { container } = render(
            <MemoryRouter>
                <TeamsList />
            </MemoryRouter>
        );
        expect(container).toMatchSnapshot();
    });

    it('should render team cards', async () => {
        vi.spyOn(CapTapApi, 'getTeams').mockResolvedValueOnce([
            { id: 1, name: 'Team 1', code: 'T1' },
            { id: 2, name: 'Team 2', code: 'T2' }
        ]);
        const { findByText } = render(
            <MemoryRouter>
                <TeamsList />
            </MemoryRouter>
            );
            screen.debug();
        expect(await findByText('Team 1')).toBeInTheDocument();
        expect(await findByText('Team 2')).toBeInTheDocument();
    });

    it('should display "no results" message if no teams are found', async () => {
        vi.spyOn(CapTapApi, 'getTeams').mockResolvedValueOnce([]);
        render(<TeamsList />);
        screen.debug();
        const noResultsMessage = await screen.findByText('Sorry, no results were found!');
        expect(noResultsMessage).toBeInTheDocument();
    });
});
