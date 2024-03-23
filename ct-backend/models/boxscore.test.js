const db = require("../db");
const Boxscore = require("./boxscore");
const { BadRequestError, NotFoundError } = require("../expressError");
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
    test("successfully adds boxscores to the database", async () => {
        const boxScoreData = [
            {
                playerId: "player1",
                gameId: "game3",
                minutes: 30,
                points: 25,
                rebounds: 10,
                assists: 5,
                steals: 2,
                blocks: 1,
                turnovers: 3,
                threePointsMade: 3,
                threePointsAttempted: 5,
            },
            {
                playerId: "player2",
                gameId: "game2",
                minutes: 30,
                points: 25,
                rebounds: 10,
                assists: 5,
                steals: 2,
                blocks: 1,
                turnovers: 3,
                threePointsMade: 3,
                threePointsAttempted: 5,
            },
        ];

        const result = await Boxscore.addAll(boxScoreData);

        expect(result).toEqual({
            success: true,
            message: "Boxscores added successfully.",
        });
    });

    test("throws a BadRequestError if unable to add boxscores", async () => {
        const boxScoreData = [
            {
                playerId: "playerX",
                gameId: "game1",
                minutes: 30,
                points: 25,
                rebounds: 10,
                assists: 5,
                steals: 2,
                blocks: 1,
                turnovers: 3,
                threePointsMade: 3,
                threePointsAttempted: 5,
            },
        ];

        await expect(Boxscore.addAll(boxScoreData)).rejects.toThrow(
            BadRequestError
        );
    });
});

/************************************** find */

describe("find", () => {
    test("successfully retrieves boxscores for a player", async () => {
        const playerId = "player1";

        const result = await Boxscore.find(playerId);
        console.log(result);
        expect(result).toBeDefined();
        expect(result[0]).toHaveProperty("minutes");
    });

    test("throws a NotFoundError if no boxscores found for the player", async () => {
        const playerId = "nonexistentplayer";

        await expect(Boxscore.find(playerId)).rejects.toThrow(NotFoundError);
    });
});
