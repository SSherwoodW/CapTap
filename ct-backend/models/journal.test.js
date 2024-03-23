const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const Journal = require("./journal");
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

/************************************** post */
describe("post", () => {
    test("successfully creates a journal entry with data", async () => {
        const userId = 1;
        const data = {
            description: "Test journal entry",
            range: "daily",
            journalPlayersData: [
                {
                    playerId: 1,
                    statCategory: "points",
                    overUnder: "Over",
                    value: 30,
                },
                {
                    playerId: 2,
                    statCategory: "rebounds",
                    overUnder: "Under",
                    value: 15,
                },
            ],
        };

        const result = await Journal.post(userId, data);

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("description", data.description);
        expect(result).toHaveProperty("range", data.range);
        expect(result.journalPlayersData).toHaveLength(2);
    });

    test("throws a BadRequestError if unable to post journal entry", async () => {
        const userId = 999;
        const data = {
            description: "Test journal entry",
            range: "daily",
            journalPlayersData: [],
        };

        await expect(Journal.post(userId, data)).rejects.toThrow(
            BadRequestError
        );
    });
});

/************************************** find */

describe("find", () => {
    test("successfully retrieves a specific journal entry", async () => {
        const journalId = 1;

        const result = await Journal.find(journalId);

        expect(result).toHaveProperty("id", journalId);
        expect(result).toHaveProperty("userId", 1);
        expect(result).toHaveProperty("description", "Test journal");
        expect(result).toHaveProperty("range", "daily");
        expect(result).toHaveProperty("createdAt");
        expect(result).toHaveProperty("journalPlayersData");
        expect(result.journalPlayersData).toHaveLength(2);
    });

    test("throws a NotFoundError if journal entry with provided ID not found", async () => {
        const journalId = 9999; // Assuming journal entry with ID 9999 does not exist

        await expect(Journal.find(journalId)).rejects.toThrow(NotFoundError);
    });
});

/************************************** findAll */

describe("findAll", () => {
    test("successfully retrieves all journal entries", async () => {
        const result = await Journal.findAll();

        expect(result).toHaveLength(1); // Assuming one entry is inserted in beforeEach
        expect(result[0]).toHaveProperty("id", 1);
        expect(result[0]).toHaveProperty("userId", 1);
        expect(result[0]).toHaveProperty("description", "Test journal");
        expect(result[0]).toHaveProperty("range", "daily");
        expect(result[0]).toHaveProperty("createdAt");
        expect(result[0]).toHaveProperty("journalPlayersData");
        expect(result[0].journalPlayersData).toHaveLength(2);
    });

    test("throws a NotFoundError if no journal entries found", async () => {
        // Clear out all journal entries
        await db.query("DELETE FROM journal_players");
        await db.query("DELETE FROM journals");

        await expect(Journal.findAll()).rejects.toThrow(NotFoundError);
    });
});

/************************************** findUserEntries */

describe("findUserEntries", () => {
    test("successfully retrieves all journal entries from a single user", async () => {
        const username = "u1";

        const result = await Journal.findUserEntries(username);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty("id", 1);
        expect(result[0]).toHaveProperty("userId", 1);
        expect(result[0]).toHaveProperty("description", "Test journal");
        expect(result[0]).toHaveProperty("range", "daily");
        expect(result[0]).toHaveProperty("createdAt");
        expect(result[0]).toHaveProperty("journalPlayersData");
        expect(result[0].journalPlayersData).toHaveLength(2);
    });

    test("throws a NotFoundError if no journal entries found for the user", async () => {
        const username = "nonexistentuser";

        await expect(Journal.findUserEntries(username)).rejects.toThrow(
            NotFoundError
        );
    });
});

/************************************** update */

describe("update", () => {
    test("successfully updates the description of a journal entry", async () => {
        const journalId = 1;
        const newDescription = "Updated journal description";

        const result = await Journal.update(newDescription, journalId);
        console.log(result);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty("userid", 1);
        expect(result[0]).toHaveProperty("description", newDescription);
        expect(result[0]).toHaveProperty("createdat");
    });

    test("throws a BadRequestError if entry is not updated", async () => {
        const journalId = 9999;
        const newDescription = "Updated journal description";

        await expect(Journal.update(newDescription, journalId)).rejects.toThrow(
            BadRequestError
        );
    });
});
