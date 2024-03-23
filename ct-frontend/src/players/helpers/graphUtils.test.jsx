import formatDate from "../../hooks/formatDate";
import generateAllGraphData, {generatePlayerGraphData} from './graphUtils';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('generatePlayerGraphData', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    });
    it('generates graph data for a player with valid data', () => {
        const playerId = 1;
        const selectedStats = [[1, 'Points']];
        const selectedPlayerData = [{ id: 1, boxscores: [{ gamedate: '2024-03-06T12:00:00Z', minutes: '10:00', points: 20, opposing_team: 'Opponent' }] }];
        const range = 1;

        const expectedData = [{ x: '3/6', y: 20, opponent: 'Opponent' }];
        const result = generatePlayerGraphData(playerId, selectedStats, selectedPlayerData, range);
        expect(result).toEqual(expectedData);
    });

    it('generates empty graph data when player data is not available', () => {
        const playerId = 1;
        const selectedStats = [[1, 'Points']];
        const selectedPlayerData = [{ id: 2, boxscores: [] }];
        const range = 1;

        const result = generatePlayerGraphData(playerId, selectedStats, selectedPlayerData, range);
        expect(result).toEqual([]);
    });
});

describe('generateAllGraphData', () => {
    it('generates graph data for all selected players', () => {
        const selectedPlayerData = [
            { id: 1, boxscores: [{ gamedate: '2022-01-01T12:01:00Z', minutes: '10:00', points: 20, opposing_team: 'Opponent' }] },
            { id: 2, boxscores: [{ gamedate: '2022-01-02T12:01:00Z', minutes: '15:00', points: 30, opposing_team: 'Opponent 2' }] }
        ];
        const values = [[1, 20], [2, 30]];
        const overUnders = [[1, 'Over'], [2, 'Under']];
        const selectedStats = [[1, 'Points'], [2, 'Points']];
        const selectedRange = 'L5';

        const expectedData = [
            { playerId: 1, data: [{ x: '1/1', y: 20, opponent: 'Opponent' }], value: 20, overUnder: 'Over', selectedStat: 'Points', range: 5 },
            { playerId: 2, data: [{ x: '1/2', y: 30, opponent: 'Opponent 2' }], value: 30, overUnder: 'Under', selectedStat: 'Points', range: 5 }
        ];

        const result = generateAllGraphData(selectedPlayerData, values, overUnders, selectedStats, selectedRange);
        expect(result).toEqual(expectedData);
    });

    it('returns empty array of graph data for players with missing values', () => {
        const selectedPlayerData = [
            { id: 1, boxscores: [{ gamedate: '2022-01-01T12:01:00Z', minutes: '10:00', points: 20, opposing_team: 'Opponent' }] },
            { id: 2, boxscores: [] }
        ];
        const values = [[1, 20], [2, 30]];
        const overUnders = [[1, 'Over'], [2, 'Under']];
        const selectedStats = [[1, 'Points'], [2, 'Assists']];
        const selectedRange = 'L5';

        const expectedData = [
            { playerId: 1, data: [{ x: '1/1', y: 20, opponent: 'Opponent' }], value: 20, overUnder: 'Over', selectedStat: 'Points', range: 5 },
            { playerId: 2, data: [], value: 30, overUnder: 'Under', selectedStat: 'Assists', range: 5 }
        ];

        const result = generateAllGraphData(selectedPlayerData, values, overUnders, selectedStats, selectedRange);
        expect(result).toEqual(expectedData);
    });
});