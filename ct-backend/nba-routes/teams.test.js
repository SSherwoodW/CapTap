const request = require("supertest");
const app = require("../app");
const axios = require("axios");
const Player = require("../models/player");
const Team = require("../models/team");
const Game = require("../models/game");
const Boxscore = require("../models/boxscore");
const { createToken } = require("../helpers/tokens");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
let u1Token;
let u2Token;
let admin1Token;
beforeAll(async function createTokens() {
    let userToken = await createToken({ username: "user1", isAdmin: false });
    u1Token = userToken;

    let user2Token = await createToken({ username: "user2", isAdmin: false });
    u2Token = user2Token;

    let adminToken = await createToken({ username: "admin1", isAdmin: true });
    admin1Token = adminToken;
});
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

jest.mock("axios");

describe("POST /teams", () => {
    test("should add teams to the database and respond with success message", async () => {
        const mockTeamData = {
            league: {
                id: "4353138d-4c22-4396-95d8-5f587d2df25c",
                name: "NBA",
                alias: "NBA",
            },
            conferences: [
                {
                    id: "3960cfac-7361-4b30-bc25-8d393de6f62f",
                    name: "EASTERN CONFERENCE",
                    alias: "EASTERN",
                    divisions: [
                        {
                            id: "54dc7348-c1d2-40d8-88b3-c4c0138e085d",
                            name: "Southeast",
                            alias: "SOUTHEAST",
                            teams: [
                                {
                                    id: "583ec8d4-fb46-11e1-82cb-f4ce4684ea4c",
                                    name: "Wizards",
                                    market: "Washington",
                                    alias: "WAS",
                                    sr_id: "sr:team:3431",
                                    reference: "1610612764",
                                    team_colors: [
                                        {
                                            type: "secondary",
                                            hex_color: "#e31837",
                                            rgb_color: {
                                                red: 227,
                                                green: 24,
                                                blue: 55,
                                            },
                                        },
                                        {
                                            type: "primary",
                                            hex_color: "#002b5c",
                                            rgb_color: {
                                                red: 0,
                                                green: 43,
                                                blue: 92,
                                            },
                                        },
                                    ],
                                    venue: {
                                        id: "f62d5b49-d646-56e9-ba60-a875a00830f8",
                                        name: "Capital One Arena",
                                        capacity: 20356,
                                        address: "601 F Street NW",
                                        city: "Washington",
                                        state: "DC",
                                        zip: "20004",
                                        country: "USA",
                                        sr_id: "sr:venue:6016",
                                        location: {
                                            lat: "38.898056",
                                            lng: "-77.020833",
                                        },
                                    },
                                },
                                {
                                    id: "583ec97e-fb46-11e1-82cb-f4ce4684ea4c",
                                    name: "Hornets",
                                    market: "Charlotte",
                                    alias: "CHA",
                                    sr_id: "sr:team:3430",
                                    reference: "1610612766",
                                    team_colors: [
                                        {
                                            type: "secondary",
                                            hex_color: "#1d1160",
                                            rgb_color: {
                                                red: 29,
                                                green: 17,
                                                blue: 96,
                                            },
                                        },
                                        {
                                            type: "primary",
                                            hex_color: "#00788c",
                                            rgb_color: {
                                                red: 0,
                                                green: 120,
                                                blue: 140,
                                            },
                                        },
                                    ],
                                    venue: {
                                        id: "a380f011-6e5d-5430-9f37-209e1e8a9b6f",
                                        name: "Spectrum Center",
                                        capacity: 19077,
                                        address: "330 E. Trade Street",
                                        city: "Charlotte",
                                        state: "NC",
                                        zip: "28202",
                                        country: "USA",
                                        sr_id: "sr:venue:6146",
                                        location: {
                                            lat: "35.225148",
                                            lng: "-80.839249",
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        axios.get.mockResolvedValueOnce(mockTeamData);

        const addAllMock = jest
            .spyOn(Team, "addAll")
            .mockResolvedValueOnce("Success");

        const response = await request(app)
            .post("/teams")
            .set("Authorization", `Bearer ${admin1Token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual("Success");
        expect(Team.addAll).toHaveBeenCalledWith([
            {
                code: "WAS",
                id: "583ec8d4-fb46-11e1-82cb-f4ce4684ea4c",
                name: "Washington Wizards",
            },
            {
                code: "CHA",
                id: "583ec97e-fb46-11e1-82cb-f4ce4684ea4c",
                name: "Charlotte Hornets",
            },
        ]);

        addAllMock.mockRestore();
    });

    test("should handle errors from SportRadar API", async () => {
        axios.get.mockRejectedValueOnce(new Error("API Error"));

        const response = await request(app)
            .post("/teams")
            .set("Authorization", `Bearer ${admin1Token}`);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            error: { message: "API Error", status: 500 },
        });
    });
});

describe("GET /teams", () => {
    test("should return all teams", async () => {
        const response = await request(app)
            .get("/teams")
            .set("Authorization", `Bearer ${u1Token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.teams)).toBe(true);
    });

    test("should throw 401 if unauthorized", async () => {
        const response = await request(app)
            .get("/teams")
            .set("Authorization", `Bearer invalidToken`);

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: { message: "Unauthorized", status: 401 },
        });
    });
});

describe("GET /teams/:criteria", () => {
    test("should return team by id", async () => {
        const response = await request(app)
            .get("/teams/1")
            .set("Authorization", `Bearer ${u1Token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.team).toBeDefined();
    });

    test("should return team by code", async () => {
        const response = await request(app)
            .get("/teams/T2")
            .set("Authorization", `Bearer ${u1Token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.team).toBeDefined();
    });

    test("should return team by name", async () => {
        const teamName = "Team 2";
        const response = await request(app)
            .get(`/teams/${teamName}`)
            .set("Authorization", `Bearer ${u1Token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.team).toBeDefined();
    });

    test("should return 401 if unauthorized", async () => {
        const response = await request(app)
            .get("/teams/1")
            .set("Authorization", `Bearer invalidToken`);

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: { message: "Unauthorized", status: 401 },
        });
    });
});
