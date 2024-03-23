import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import GameLog from "./Gamelog";

describe("Gamelog", () => {
    it("renders the component", () => {
        render(<GameLog boxscores={[]} />)
    });

    it('matches snapshot', () => {
        const gameLogPage = render(
            <GameLog boxscores={[]}/>
        )
        expect(gameLogPage).toMatchSnapshot();
    });

    it('renders up to 5 game rows when boxscores length is less than or equal to 5', () => {
        const boxscores = [
        { gamedate: '2022-01-01', opposing_team: 'Opponent 1', minutes: '30:00', points: 20, rebounds: 10, assists: 5, turnovers: 3, steals: 2, blocks: 1, threepointsmade: 2, threepointsattempted: 5 },
        { gamedate: '2022-01-02', opposing_team: 'Opponent 2', minutes: '25:00', points: 15, rebounds: 5, assists: 8, turnovers: 2, steals: 3, blocks: 0, threepointsmade: 1, threepointsattempted: 3 },
        ];

        render(<GameLog boxscores={boxscores} />);
        
        expect(screen.getByText('Opponent 1')).toBeDefined();

        // see if 'showmore' button is not displayed
        const button = screen.queryByRole('button')
        expect(button).toBeNull();
    });

    it('renders "Show More" button when boxscores length is greater than 5', () => {
        const boxscores = [
        { gamedate: '2022-01-01', opposing_team: 'Opponent 1', minutes: '30:00', points: 20, rebounds: 10, assists: 5, turnovers: 3, steals: 2, blocks: 1, threepointsmade: 2, threepointsattempted: 5 },
        { gamedate: '2022-01-02', opposing_team: 'Opponent 2', minutes: '25:00', points: 15, rebounds: 5, assists: 8, turnovers: 2, steals: 3, blocks: 0, threepointsmade: 1, threepointsattempted: 3 },
        { gamedate: '2022-01-03', opposing_team: 'Opponent 3', minutes: '25:00', points: 15, rebounds: 5, assists: 8, turnovers: 2, steals: 3, blocks: 0, threepointsmade: 1, threepointsattempted: 3 },
        { gamedate: '2022-01-04', opposing_team: 'Opponent 4', minutes: '25:00', points: 15, rebounds: 5, assists: 8, turnovers: 2, steals: 3, blocks: 0, threepointsmade: 1, threepointsattempted: 3 },
        { gamedate: '2022-01-05', opposing_team: 'Opponent 5', minutes: '25:00', points: 15, rebounds: 5, assists: 8, turnovers: 2, steals: 3, blocks: 0, threepointsmade: 1, threepointsattempted: 3 },
        { gamedate: '2022-01-06', opposing_team: 'Opponent 6', minutes: '25:00', points: 15, rebounds: 5, assists: 8, turnovers: 2, steals: 3, blocks: 0, threepointsmade: 1, threepointsattempted: 3 },
        ];

        render(<GameLog boxscores={boxscores} />);
        
        expect(screen.getByText('Opponent 1')).toBeDefined();

        // see if 'showmore' button is displayed
        const button = screen.queryByRole('button')
        expect(button).toBeDefined();
    });

    it('toggles "Show More" button and displays more gamelogs when clicked', () => {
        const boxscores = [
        { gamedate: '2022-01-01', opposing_team: 'Opponent 1', minutes: '30:00', points: 20, rebounds: 10, assists: 5, turnovers: 3, steals: 2, blocks: 1, threepointsmade: 2, threepointsattempted: 5 },
        { gamedate: '2022-01-02', opposing_team: 'Opponent 2', minutes: '25:00', points: 15, rebounds: 5, assists: 8, turnovers: 2, steals: 3, blocks: 0, threepointsmade: 1, threepointsattempted: 3 },
        { gamedate: '2022-01-03', opposing_team: 'Opponent 3', minutes: '25:00', points: 15, rebounds: 5, assists: 8, turnovers: 2, steals: 3, blocks: 0, threepointsmade: 1, threepointsattempted: 3 },
        { gamedate: '2022-01-04', opposing_team: 'Opponent 4', minutes: '25:00', points: 15, rebounds: 5, assists: 8, turnovers: 2, steals: 3, blocks: 0, threepointsmade: 1, threepointsattempted: 3 },
        { gamedate: '2022-01-05', opposing_team: 'Opponent 5', minutes: '25:00', points: 15, rebounds: 5, assists: 8, turnovers: 2, steals: 3, blocks: 0, threepointsmade: 1, threepointsattempted: 3 },
        { gamedate: '2022-01-06', opposing_team: 'Opponent 6', minutes: '25:00', points: 15, rebounds: 5, assists: 8, turnovers: 2, steals: 3, blocks: 0, threepointsmade: 1, threepointsattempted: 3 },
        ];

        render(<GameLog boxscores={boxscores} />);
        screen.debug();
        expect(screen.queryByText('Opponent 6')).toBeNull();

        const showMoreButton = screen.getByText('Show More');
        act(() => {
            showMoreButton.click()
        })

        expect(screen.queryByText('Opponent 6')).toBeDefined();
        expect(showMoreButton.textContent).toBe('Show Less');
    })
})