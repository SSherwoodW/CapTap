const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const Player = require("./player");
let regularSeasonId = "f1162fd1-29c5-4c29-abb4-57b78f16d238";
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

/****************************************** addAll */

describe("addAll", () => {
    test("successfully adds players to the database", async () => {
        const playerData = [
            {
                playerId: "player5",
                firstName: "John",
                lastName: "Doe",
                fullName: "John Doe",
                seasonId: regularSeasonId,
                teamId: "team1",
            },
            {
                playerId: "player6",
                firstName: "Jane",
                lastName: "Doe",
                fullName: "Jane Doe",
                seasonId: regularSeasonId,
                teamId: "team2",
            },
        ];

        const result = await Player.addAll(playerData);

        expect(result).toEqual({
            success: true,
            message: "Players added successfully.",
        });

        const players = await db.query("SELECT * FROM players");
        expect(players.rows).toHaveLength(6);
    });

    test("throws BadRequestError if unable to add players", async () => {
        const playerData = [
            {
                playerId: "player1",
                firstName: "John",
                lastName: "Doe",
                fullName: "John Doe",
            }, // Missing teamId
            {
                playerId: "player2",
                firstName: "Jane",
                lastName: "Doe",
                fullName: "Jane Doe",
                teamId: "teamDontExist",
            },
        ];

        await expect(Player.addAll(playerData)).rejects.toThrow(
            BadRequestError
        );
    });
});

/****************************************** find */

describe("find", () => {
    test("successfully retrieves player and their teammates from the database", async () => {
        const playerId = 1;
        const playerData = await Player.find(playerId);
        expect(playerData).toBeDefined();
        expect(playerData).toHaveProperty("apiid");
        expect(playerData).toHaveProperty("fullname");
        expect(playerData).toHaveProperty("name");
        expect(playerData).toHaveProperty("teammates");
        expect(Array.isArray(playerData.teammates)).toBeTruthy();
        // Add more assertions to verify the correctness of the retrieved player data and teammates
    });

    test("throws a BadRequestError if playerId is not provided", async () => {
        await expect(Player.find()).rejects.toThrow(NotFoundError);
    });

    test("throws a NotFoundError if no player found with the provided playerId", async () => {
        const playerId = 9999; // Assuming player with ID 9999 does not exist in the database
        await expect(Player.find(playerId)).rejects.toThrow(NotFoundError);
    });

    test("returns playerData with empty 'teammates' array if player has no teammates", async () => {
        const playerId = 2;
        const playerData = await Player.find(playerId);
        expect(playerData.teammates).toEqual([]);
    });
});

/****************************************** findBy */

describe("findBy", () => {
    beforeEach(async () => {
        const playerData = [
            {
                playerId: "player5",
                firstName: "John",
                lastName: "Doe",
                fullName: "John Doe",
                seasonId: regularSeasonId,
                teamId: "team1",
            },
            {
                playerId: "player6",
                firstName: "Jane",
                lastName: "Doe",
                fullName: "Jane Doe",
                seasonId: regularSeasonId,
                teamId: "team2",
            },
        ];

        const result = await Player.addAll(playerData);
        console.log(result);
    });

    test("successfully finds players by first name", async () => {
        const criteria = { firstName: "John" };

        const players = await Player.findBy(criteria);

        expect(players).toHaveLength(1);
        expect(players[0].name).toBe("John Doe");
    });

    test("successfully finds players by last name", async () => {
        const criteria = { lastName: "Doe" };

        const players = await Player.findBy(criteria);

        expect(players).toHaveLength(2);
        expect(players[0].name).toBe("John Doe");
        expect(players[1].name).toBe("Jane Doe");
    });

    test("successfully finds players by full name", async () => {
        const criteria = { fullName: "John Doe" };

        const players = await Player.findBy(criteria);

        expect(players).toHaveLength(1);
        expect(players[0].name).toBe("John Doe");
    });

    test("returns all players if no search criteria provided", async () => {
        const players = await Player.findBy({});

        expect(players).toHaveLength(6);
    });

    test("returns empty array if no players found matching the criteria", async () => {
        const criteria = { fullName: "Non Existent Player" };

        const players = await Player.findBy(criteria);

        expect(players).toHaveLength(0);
    });

    test('returns { success: false, message: "Invalid criteria" } if invalid criteria provided', async () => {
        const criteria = { invalidKey: "Invalid value" };

        const result = await Player.findBy(criteria);

        expect(result).toEqual({ success: false, message: "Invalid criteria" });
    });
});
