import {
    nullGameDates,
    createHitList,
    calculateCorrelation,
    hitRate,
    missList,
} from './Correlator';

describe('nullGameDates', () => {
    it('should return an array of game dates where the y value is null', () => {
        const playerData = [
            { data: [{ x: '2022-01-01', y: 10 }, { x: '2022-01-02', y: null }] },
            { data: [{ x: '2022-01-01', y: null }, { x: '2022-01-02', y: 20 }] },
        ];
        const result = nullGameDates(playerData);
        expect(result).toEqual(['2022-01-02', '2022-01-01']);
    });

    it('should return an empty array if there are no null game dates', () => {
        const playerData = [
            { data: [{ x: '2022-01-01', y: 10 }, { x: '2022-01-02', y: 10 }] },
            { data: [{ x: '2022-01-01', y: 10 }, { x: '2022-01-02', y: 20 }] },
        ];
        const result = nullGameDates(playerData);
        expect(result).toEqual([]);
    })
});

describe('createHitList', () => {
    it('should return a nested array of game dates where players hit their targeted values', () => {
        const playerData = [
            { overUnder: 'Over', value: 15, data: [{ x: '2022-01-01', y: 10 }, { x: '2022-01-02', y: 20 }] },
            { overUnder: 'Under', value: 15, data: [{ x: '2022-01-01', y: 20 }, { x: '2022-01-02', y: 10 }] },
        ];
        const result = createHitList(playerData);
        expect(result).toEqual([['2022-01-02'], ['2022-01-02']]);
    });

    it('should return an empty nested array if no players hit their targeted values', () => {
        const playerData = [
            { overUnder: 'Over', value: 15, data: [{ x: '2022-01-01', y: 10 }, { x: '2022-01-02', y: 10 }] },
            { overUnder: 'Under', value: 15, data: [{ x: '2022-01-01', y: 20 }, { x: '2022-01-02', y: 20 }] },
        ];
        const result = createHitList(playerData);
        expect(result).toEqual([[], []]);
    });
});

describe('calculateCorrelation', () => {
    it('should return a percentage correlating player hit rates when no null dates', () => {
        const hitListArr = createHitList([
            { overUnder: 'Over', value: 15, data: [{ x: '2022-01-01', y: 10 }, { x: '2022-01-02', y: 20 }, { x: '2022-01-03', y: 20 }] },
            { overUnder: 'Under', value: 15, data: [{ x: '2022-01-01', y: 20 }, { x: '2022-01-02', y: 10 }, { x: '2022-01-03', y: 10 }] },
        ]);
        const playerData = [
            { data: [{ x: '2022-01-01', y: 10 }, { x: '2022-01-02', y: 20 }, { x: '2022-01-03', y: 20 }] },
            { data: [{ x: '2022-01-01', y: 20 }, { x: '2022-01-02', y: 10 }, { x: '2022-01-03', y: 10 }] },
        ];
        const result = calculateCorrelation(hitListArr, playerData);

        expect(result).toEqual(67);
    });

    it('should return 100 for single player', () => {
        const hitListArr = createHitList([
            { overUnder: 'Over', value: 15, data: [{ x: '2022-01-01', y: 10 }, { x: '2022-01-02', y: 20 }, { x: '2022-01-03', y: 20 }] },
        ]);
        const playerData = [
            { data: [{ x: '2022-01-01', y: 10 }, { x: '2022-01-02', y: 20 }, { x: '2022-01-03', y: 20 }] },
        ];
        const result = calculateCorrelation(hitListArr, playerData);

        expect(result).toEqual(67);
    });

    it('should return a percentage correlating player hit rates when there are null dates', () => {
        const hitListArr = createHitList([
            { overUnder: 'Over', value: 15, data: [{ x: '2022-01-01', y: null }, { x: '2022-01-02', y: 20 }, { x: '2022-01-03', y: 20 }] },
            { overUnder: 'Under', value: 15, data: [{ x: '2022-01-01', y: 20 }, { x: '2022-01-02', y: 10 }, { x: '2022-01-03', y: null }] },
        ]);
        
        const playerData = [
            { data: [{ x: '2022-01-01', y: null }, { x: '2022-01-02', y: 20 }, { x: '2022-01-03', y: 20 }] },
            { data: [{ x: '2022-01-01', y: 20 }, { x: '2022-01-02', y: 10 }, { x: '2022-01-03', y: null }] },
        ];

        const result = calculateCorrelation(hitListArr, playerData);

        expect(result).toEqual(100);
    });
});

describe('hitRate', () => {
    it('should return the correct hit rate when there are no null values', () => {
        const data = {
            overUnder: 'Over',
            value: 15,
            range: 5,
            data: [{ y: 10 }, { y: 20 }, { y: 25 }, { y: 25 }, { y: 25 }],
        };
        const result = hitRate(data);
        expect(result).toEqual(80);
    });

    it('should return the correct hit rate when there are null values', () => {
        const data = {
            overUnder: 'Over',
            value: 15,
            range: 5,
            data: [{ y: 10 }, { y: null }, { y: 25 }, { y: 25 }, { y: null }],
        };
        const result = hitRate(data);
        expect(Math.round(result)).toEqual(67);
    });

    it('should handle range as Infinity correctly', () => {
        const data = {
            overUnder: 'Over',
            value: 15,
            range: Infinity,
            data: [{ y: 15 }, { y: 20 }, { y: 25 }],
        };
        const result = hitRate(data);
        expect(Math.round(result)).toEqual(100);
    });

    it('should return 0 when there are no valid games', () => {
        const data = {
            overUnder: 'Over',
            value: 15,
            range: 10,
            data: [],
        };
        const result = hitRate(data);
        expect(Math.round(result)).toEqual(0);
    });
});

describe('missList', () => {
    it('should return the list of opponents and stat values when overUnder is "Over"', () => {
        const data = {
            overUnder: 'Over',
            value: 15,
            data: [
                { x: '2022-01-01', y: 10, opponent: 'Team A' },
                { x: '2022-01-02', y: 20, opponent: 'Team B' },
                { x: '2022-01-03', y: 25, opponent: 'Team C' },
            ],
        };
        const result = missList(data);
        expect(result).toEqual([
            { opponent: 'Team A', amount: 10, date: '2022-01-01' }
        ]);
    });

    it('should return the list of opponents and stat values when overUnder is "Under"', () => {
        const data = {
            overUnder: 'Under',
            value: 15,
            data: [
                { x: '2022-01-01', y: 10, opponent: 'Team A' },
                { x: '2022-01-02', y: 20, opponent: 'Team B' },
                { x: '2022-01-03', y: 25, opponent: 'Team C' },
            ],
        };
        const result = missList(data);
        expect(result).toEqual([
            { opponent: 'Team B', amount: 20, date: '2022-01-02' },
            { opponent: 'Team C', amount: 25, date: '2022-01-03' },
        ]);
    });

    it('should return an empty array when there are no misses', () => {
        const data = {
            overUnder: 'Under',
            value: 25,
            data: [
                { x: '2022-01-01', y: 20, opponent: 'Team A' },
                { x: '2022-01-02', y: 20, opponent: 'Team B' },
                { x: '2022-01-03', y: 24, opponent: 'Team C' },
            ],
        };
        const result = missList(data);
        expect(result).toEqual([]);
    });

    it('should return an empty array when there are no games', () => {
        const data = {
            overUnder: 'Under',
            value: 25,
            data: [],
        };
        const result = missList(data);
        expect(result).toEqual([]);
    });
});


