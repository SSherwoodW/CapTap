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

describe("POST /players", () => {
    test("should add players to the database and respond with success message", async () => {
        const mockPlayerData = {
            id: "583ec825-fb46-11e1-82cb-f4ce4684ea4c",
            name: "Warriors",
            market: "Golden State",
            alias: "GSW",
            founded: 1946,
            sr_id: "sr:team:3428",
            reference: "1610612744",
            venue: {
                id: "938016dc-9e1d-4abc-88f5-3a7d772332e6",
                name: "Chase Center",
                capacity: 18064,
                address: "1 Warriors Way",
                city: "San Francisco",
                state: "CA",
                zip: "94158",
                country: "USA",
                sr_id: "sr:venue:44446",
                location: {
                    lat: "37.7679",
                    lng: "-122.3873",
                },
            },
            league: {
                id: "4353138d-4c22-4396-95d8-5f587d2df25c",
                name: "NBA",
                alias: "NBA",
            },
            conference: {
                id: "7fe7e212-de01-4f8f-a31d-b9f0a95731e3",
                name: "WESTERN CONFERENCE",
                alias: "WESTERN",
            },
            division: {
                id: "f074cb3e-90cf-42e1-8067-cdbcd99ec230",
                name: "Pacific",
                alias: "PACIFIC",
            },
            coaches: [
                {
                    id: "04bb3fde-d798-44a1-a4c1-2c98c9bbf04b",
                    full_name: "Steve Kerr",
                    first_name: "Steve",
                    last_name: "Kerr",
                    position: "Head Coach",
                    reference: "204005",
                },
            ],
            team_colors: [
                {
                    type: "primary",
                    hex_color: "#006bb6",
                    rgb_color: {
                        red: 0,
                        green: 107,
                        blue: 182,
                    },
                },
                {
                    type: "secondary",
                    hex_color: "#fdb927",
                    rgb_color: {
                        red: 253,
                        green: 185,
                        blue: 39,
                    },
                },
            ],
            players: [
                {
                    id: "06255060-3d3d-44f6-a776-2aab8e57584a",
                    status: "ACT",
                    full_name: "Dario Saric",
                    first_name: "Dario",
                    last_name: "Saric",
                    abbr_name: "D.Saric",
                    height: 82,
                    weight: 225,
                    position: "F-C",
                    primary_position: "PF",
                    jersey_number: "20",
                    experience: "6",
                    birth_place: "Sibenik,, HRV",
                    birthdate: "1994-04-08",
                    updated: "2023-10-05T15:30:38Z",
                    sr_id: "sr:player:607702",
                    rookie_year: 2016,
                    reference: "203967",
                    draft: {
                        team_id: "583ed157-fb46-11e1-82cb-f4ce4684ea4c",
                        year: 2014,
                        round: "1",
                        pick: "12",
                    },
                },
                {
                    id: "09132733-2306-42e8-869e-2172ed2c77e0",
                    status: "ACT",
                    full_name: "Lester Quinones",
                    first_name: "Lester",
                    last_name: "Quinones",
                    abbr_name: "L.Quinones",
                    height: 76,
                    weight: 208,
                    position: "G",
                    primary_position: "SG",
                    jersey_number: "25",
                    experience: "1",
                    college: "Memphis",
                    high_school: "Brentwood (NY)",
                    birth_place: "Brentwood, NY, USA",
                    birthdate: "2000-11-16",
                    updated: "2024-02-21T13:15:25Z",
                    sr_id: "sr:player:1830342",
                    rookie_year: 2022,
                    reference: "1631311",
                    draft: {
                        year: 2022,
                    },
                },
                {
                    id: "21ed49ae-44cf-4031-9b6f-a48fb8a3e41c",
                    status: "TWO-WAY",
                    full_name: "Pat Spencer",
                    first_name: "Pat",
                    last_name: "Spencer",
                    abbr_name: "P.Spencer",
                    height: 75,
                    weight: 205,
                    position: "G",
                    primary_position: "PG",
                    jersey_number: "61",
                    experience: "0",
                    college: "Northwestern",
                    high_school: "Boys' Latin (MD)",
                    birth_place: "Davidsonville, MD, USA",
                    birthdate: "1996-07-04",
                    updated: "2024-02-22T23:48:10Z",
                    sr_id: "sr:player:1829390",
                    reference: "1630311",
                    draft: {
                        year: 2022,
                    },
                },
            ],
        };
        axios.get.mockResolvedValueOnce(mockPlayerData);

        const addAllMock = jest
            .spyOn(Player, "addAll")
            .mockResolvedValueOnce("Success");

        const response = await request(app)
            .post("/players")
            .set("Authorization", `Bearer ${admin1Token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual("Success");

        expect(Player.addAll).toHaveBeenCalledWith(expect.any(Array));

        addAllMock.mockRestore();
    });

    test("should handle errors from SportRadar API", async () => {
        axios.get.mockRejectedValueOnce(new Error("API Error"));

        const response = await request(app)
            .post("/players")
            .set("Authorization", `Bearer ${admin1Token}`);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            error: { message: "API Error", status: 500 },
        });
    });
});

describe("GET /players", () => {
    test("should return all players when no search filter provided", async () => {
        const response = await request(app)
            .get("/players")
            .set("Authorization", `Bearer ${u1Token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.players).toBeDefined();
        expect(Array.isArray(response.body.players)).toBe(true);
    });

    test("should return players matching search filter", async () => {
        const searchFilter = "Player One";
        const response = await request(app)
            .get(`/players?full_name=${encodeURIComponent(searchFilter)}`)
            .set("Authorization", `Bearer ${u1Token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.players).toBeDefined();
        expect(Array.isArray(response.body.players)).toBe(true);
        console.log("response players", response.body.players);
        expect(
            response.body.players.some((player) =>
                player.name.includes(searchFilter)
            )
        ).toBe(true);
    });

    test("should return empty array if no players match search filter", async () => {
        const searchFilter = "Nonexistent Player";
        const response = await request(app)
            .get(`/players?full_name=${encodeURIComponent(searchFilter)}`)
            .set("Authorization", `Bearer ${u1Token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.players).toEqual([]);
    });

    test("should handle errors from Player model", async () => {
        // Make request to the route with an invalid authorization token
        const response = await request(app)
            .get("/players")
            .set("Authorization", "Bearer invalidToken");

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: { message: "Unauthorized", status: 401 },
        });
    });
});

describe("GET /players/:id", () => {
    test("should return player information including game log", async () => {
        const playerId = 1;

        const response = await request(app)
            .get(`/players/${playerId}`)
            .set("Authorization", `Bearer ${u1Token}`);

        // Assert that the request was successful
        expect(response.statusCode).toBe(200);

        expect(response.body.player).toBeDefined();
        expect(response.body.player.apiid).toBe("player1");
        expect(response.body.player.boxscores).toBeDefined();

        expect(Array.isArray(response.body.player.boxscores)).toBe(true);
    });

    test("should return 404 if player ID does not exist", async () => {
        const nonExistentPlayerId = 999;

        const response = await request(app)
            .get(`/players/${nonExistentPlayerId}`)
            .set("Authorization", `Bearer ${u1Token}`);

        expect(response.statusCode).toBe(404);
    });
});
