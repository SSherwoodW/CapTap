const {
    parseTeamData,
    parsePlayerData,
    parseBoxScoreData,
    parseGameData,
} = require("./api");

describe("parseTeamData", () => {
    test("should parse team data correctly", () => {
        const data = {
            data: {
                conferences: [
                    {
                        divisions: [
                            {
                                teams: [
                                    {
                                        id: "1",
                                        market: "Team",
                                        name: "A",
                                        alias: "TA",
                                    },
                                    {
                                        id: "2",
                                        market: "Team",
                                        name: "B",
                                        alias: "TB",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        };

        const teamsData = parseTeamData(data);

        expect(teamsData).toEqual([
            { id: "1", name: "Team A", code: "TA" },
            { id: "2", name: "Team B", code: "TB" },
        ]);
    });

    test("should throw error if dataset is empty", () => {
        const emptyData = {
            data: {},
        };

        expect(() => {
            parseTeamData(emptyData).toThrow();
        });
    });
});

describe("parsePlayerData", () => {
    test("should parse player data correctly", () => {
        const data = [
            {
                id: 1,
                players: [
                    {
                        id: 101,
                        full_name: "Player One",
                        first_name: "Player",
                        last_name: "One",
                    },
                ],
            },
            {
                id: 2,
                players: [
                    {
                        id: 102,
                        full_name: "Player Two",
                        first_name: "Player",
                        last_name: "Two",
                    },
                ],
            },
        ];

        const playerData = parsePlayerData(data);
        console.log(playerData);
        const expected = [
            {
                teamId: 1,
                playerId: 101,
                fullName: "Player One",
                firstName: "Player",
                lastName: "One",
            },
            {
                teamId: 2,
                playerId: 102,
                fullName: "Player Two",
                firstName: "Player",
                lastName: "Two",
            },
        ];

        expect(playerData).toEqual(expected);
    });

    test("throws BadRequestError when no player data is provided", () => {
        const dataArray = null;

        expect(() => {
            parsePlayerData(dataArray);
        }).toThrowError("No player data");
    });
});

describe("parseGameData function", () => {
    test("should return an array of game objects with data for DB Insertion", () => {
        const data = {
            data: {
                games: [
                    {
                        id: 1,
                        scheduled: "2024-02-21",
                        home: { id: 10 },
                        away: { id: 20 },
                    },
                    {
                        id: 2,
                        scheduled: "2024-02-22",
                        home: { id: 15 },
                        away: { id: 25 },
                    },
                ],
            },
        };

        const expected = [
            {
                gameId: 1,
                scheduled: "2024-02-21",
                homeTeamId: 10,
                awayTeamId: 20,
            },
            {
                gameId: 2,
                scheduled: "2024-02-22",
                homeTeamId: 15,
                awayTeamId: 25,
            },
        ];

        expect(parseGameData(data)).toEqual(expected);
    });

    test("should throw error if no game data is provided", () => {
        const data = {};

        expect(() => {
            parseGameData(data);
        }).toThrowError("No game data");
    });

    test("should throw error if game data is empty", () => {
        const data = { data: { games: [] } };

        expect(() => {
            parseGameData(data);
        }).toThrowError("No game data");
    });

    test("should throw error if game data is invalid", () => {
        const data = {
            data: {
                games: [
                    { id: 1, scheduled: "2024-02-21", home: { id: 10 } }, // Missing away team
                    { id: 2, scheduled: "2024-02-22", away: { id: 25 } }, // Missing home team
                ],
            },
        };

        expect(() => {
            parseGameData(data);
        }).toThrowError("Error fetching game data");
    });
});

describe("parseBoxScoreData", () => {
    test("should parse box score data correctly", () => {
        const gameId = "123";
        const data = {
            gameId: "123",
            players: [
                {
                    id: "1",
                    statistics: {
                        minutes: 20,
                        points: 10,
                        rebounds: 5,
                        assists: 3,
                        steals: 2,
                        blocks: 1,
                        turnovers: 2,
                        three_points_made: 2,
                        three_points_att: 5,
                    },
                },
                {
                    id: "2",
                    statistics: {
                        minutes: 3,
                        points: 130,
                        rebounds: 53,
                        assists: 33,
                        steals: 23,
                        blocks: 13,
                        turnovers: 2,
                        three_points_made: 32,
                        three_points_att: 35,
                    },
                },
            ],
        };

        const expected = [
            {
                playerId: "1",
                gameId: "123",
                minutes: 20,
                points: 10,
                rebounds: 5,
                assists: 3,
                steals: 2,
                blocks: 1,
                turnovers: 2,
                threePointsMade: 2,
                threePointsAttempted: 5,
            },
            {
                playerId: "2",
                gameId: "123",
                minutes: 3,
                points: 130,
                rebounds: 53,
                assists: 33,
                steals: 23,
                blocks: 13,
                turnovers: 2,
                threePointsMade: 32,
                threePointsAttempted: 35,
            },
        ];

        expect(parseBoxScoreData(gameId, data)).toEqual(expected);
    });

    test("should throw error if box score data is missing", () => {
        const gameId = "123";
        const data = {
            gameId: "123",
        };

        expect(() => {
            parseBoxScoreData(gameId, data);
        }).toThrowError("Inside parseBoxScoreData: no boxscore data.");
    });
});
