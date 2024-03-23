const db = require("../db");
const { BadRequestError } = require("../expressError");
const Game = require("./game");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** addAll */

describe("addAll", () => {
    test("it successfully adds games to the database", async () => {
        const newGameData = [
            {
                gameId: "game6",
                homeTeamId: "team1",
                awayTeamId: "team2",
                scheduled: "2024-01-01",
            },
            {
                gameId: "game7",
                homeTeamId: "team3",
                awayTeamId: "team2",
                scheduled: "2024-01-02",
            },
        ];

        const result = await Game.addAll(newGameData);
        expect(result).toEqual({
            success: true,
            message: "Games added successfully.",
        });

        const games = await db.query("SELECT * FROM games");
        expect(games.rows.length).toBeGreaterThan(0);
    });

    test("it throws BadRequestError when unable to add games", async () => {
        const gameData = [
            {
                gameId: 1,
                homeTeamId: "team1",
                awayTeamId: "team2",
                scheduled: "invalid-date",
            },
        ];
        await expect(Game.addAll(gameData)).rejects.toThrow(BadRequestError);
    });
});

/************************************** playerGames */

describe("playerGames", () => {
    test("successfully retrieves games played by a specific player", async () => {
        const playerId = 1;
        const limit = 2;

        const games = await Game.playerGames(playerId, limit);

        expect(games).toBeDefined();
        expect(Array.isArray(games)).toBe(true);
        expect(games.length).toBeGreaterThan(0);
        expect(games.length).toBeLessThan(3);
        expect(games[0]).toHaveProperty("api_id");
        expect(games[0]).toHaveProperty("game_date");
    });

    test("successfully retrieves all games played by a specific player without limit param", async () => {
        const playerId = 1;

        const games = await Game.playerGames(playerId);

        expect(games).toBeDefined();
        expect(Array.isArray(games)).toBe(true);
        expect(games.length).toBeGreaterThan(0);
        expect(games[0]).toHaveProperty("api_id");
        expect(games[0]).toHaveProperty("game_date");
    });

    test("returns empty array if player has no games", async () => {
        // Use playerid of player 'NoGames' from _testCommon

        const games = await Game.playerGames(3);

        // Assert that an empty array is returned
        expect(games).toBeDefined();
        expect(Array.isArray(games)).toBe(true);
        expect(games.length).toBe(0);
    });

    test("throws BadRequestError if player doesn't exist", async () => {
        const playerId = 999;

        await expect(Game.playerGames(playerId)).rejects.toThrow(
            BadRequestError
        );
    });

    test("throws an error if playerId is not provided", async () => {
        // Call the playerGames method without providing playerId
        await expect(Game.playerGames()).rejects.toThrow();
    });
});

/************************************** team */

describe("team", () => {
    test("successfully retrieves teams connected to games", async () => {
        const teamId = "team1";
        const teams = await Game.team(teamId);
        expect(teams).toHaveLength(4);
    });

    test("returns empty array if no games connected to team", async () => {
        const teamId = "teamNoGames";
        const teams = await Game.team(teamId);
        expect(teams).toHaveLength(0);
    });

    test("throws an error if teamId is not provided", async () => {
        await expect(Game.team()).rejects.toThrow();
    });

    test("throws an error if teamId is not found in the database", async () => {
        const teamId = "nonexistentteam";
        await expect(Game.team(teamId)).rejects.toThrow(BadRequestError);
    });

    test("throws an error if no team data found for the provided teamId", async () => {
        const teamId = "teamDoesNotExists";
        await expect(Game.team(teamId)).rejects.toThrow(BadRequestError);
    });
});
