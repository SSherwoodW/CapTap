const Team = require("./team");
const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
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

describe("Team.addAll", () => {
    test("successfully adds teams to the database", async () => {
        const newTeamData = [
            { id: "team4", name: "Team 4", code: "T4" },
            { id: "team5", name: "Team 5", code: "T5" },
        ];
        const result = await Team.addAll(newTeamData);

        expect(result).toEqual({
            success: true,
            message: "Teams added successfully.",
        });

        const teams = await Team.findAll();
        expect(teams).toHaveLength(6);
    });

    test("throws BadRequestError if unable to add teams", async () => {
        const duplicateTeamData = [
            { id: "team1", name: "Duplicate Team", code: "DT" },
        ];
        await expect(Team.addAll(duplicateTeamData)).rejects.toThrowError(
            BadRequestError
        );
    });
});

describe("Team.findAll", () => {
    test("successfully retrieves all teams from the database", async () => {
        const teams = await Team.findAll();
        expect(teams).toHaveLength(4);
    });
});

describe("Team.findBy", () => {
    test("successfully finds team by id", async () => {
        const criteria = { id: 1 };
        const team = await Team.findBy(criteria);

        expect(team).toBeDefined();
        expect(team.name).toBe("Team 1");
    });

    test("successfully finds team by name", async () => {
        const criteria = { name: "Team 2" };
        const team = await Team.findBy(criteria);

        expect(team).toBeDefined();
        expect(team.id).toBe(2);
    });

    test("successfully finds team by code", async () => {
        const criteria = { code: "T3" };
        const team = await Team.findBy(criteria);

        expect(team).toBeDefined();
        expect(team.id).toBe(3);
    });

    test('returns { success: false, message: "Invalid criteria" } if invalid criteria provided', async () => {
        const criteria = { invalidKey: "Invalid value" };

        const result = await Team.findBy(criteria);

        expect(result).toEqual({ success: false, message: "Invalid criteria" });
    });

    test("returns NotFoundError if no team found matching the criteria", async () => {
        const criteria = { name: "Non Existent Team" };

        await expect(Team.findBy(criteria)).rejects.toThrowError(NotFoundError);
    });
});

describe("Team.getRoster", () => {
    test("successfully retrieves roster for a team", async () => {
        const apiId = "team1";
        const roster = await Team.getRoster(apiId);

        expect(roster).toBeDefined();
        expect(roster).toHaveLength(2);
    });

    test("throws NotFoundError if unable to find players for the team", async () => {
        const apiId = "nonexistentteam";
        await expect(Team.getRoster(apiId)).rejects.toThrowError(NotFoundError);
    });
});
