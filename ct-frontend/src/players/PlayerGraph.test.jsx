import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, it, vi } from 'vitest';
import PlayerGraph from './PlayerGraph';

// Mock Victory components
vi.mock('victory', async () => {
    const mod = await vi.importActual('victory')
    return {
        ...mod,
        VictoryChart: vi.fn((props) => <svg data-testid="victory-chart" {...props} />),
        VictoryLine: vi.fn((props) => <path data-testid="victory-line" {...props} />),
        VictoryBar: vi.fn((props) => <rect data-testid="victory-bar" {...props} />),
        VictoryLabel: vi.fn((props) => <text data-testid="victory-label" {...props} />),
        VictoryAxis: vi.fn((props) => <g data-testid="victory-axis" {...props} />),
    }
});

describe('PlayerGraph', () => {
    it('renders player graph with data', () => {
        const playerGraphData = [
        {
            playerId: 1,
            data: [{ x: 1, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }],
            value: 20,
            range: 10,
            overUnder: 'Over',
            selectedStat: 'Points',
        },
        ];
        const player = { id: 1 };
        const hitStats = [
        { playerId: 1, hitRate: 75 },
        { playerId: 2, hitRate: 80 },
        ];

        const { getByTestId } = render(
        <PlayerGraph playerGraphData={playerGraphData} player={player} hitStats={hitStats} />
        );
        expect(getByTestId('victory-chart')).toBeInTheDocument();
        expect(getByTestId('victory-line')).toBeInTheDocument();
        expect(getByTestId('victory-bar')).toBeInTheDocument();
        expect(getByTestId('victory-label')).toBeInTheDocument();
    });
    
    it('does not render a graph without complete data', () => {
        const playerGraphData = [
            {
                playerId: 1,
                data: [{ x: 1, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 }],
                value: 20,
                range: 10,
                overUnder: 'Over',
                selectedStat: 'Points',
            },
        ];
        const player = { id: 1 };
        const hitStats = "oopsy doopsy!"

        const { getByText } = render(
            <PlayerGraph playerGraphData={playerGraphData} player={player} hitStats={hitStats} />
        );

        const h4Element = getByText(/Set data points to build a graph/i); // Case-insensitive search
        expect(h4Element).toBeInTheDocument();
    });
});
