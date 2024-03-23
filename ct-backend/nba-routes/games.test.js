const request = require("supertest");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const app = require("../app");
const Game = require("../models/game");
const { createToken } = require("../helpers/tokens");
const API_KEY = require("../secret/secret");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

const mock = new MockAdapter(axios);

afterEach(() => {
    mock.reset();
});

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

describe("POST /games", () => {
    test("should add games to the database and respond with success message", async () => {
        const mockGamesResponse = {
            league: {
                id: "4353138d-4c22-4396-95d8-5f587d2df25c",
                name: "NBA",
                alias: "NBA",
            },
            season: {
                id: "f1162fd1-29c5-4c29-abb4-57b78f16d238",
                year: 2023,
                type: "REG",
            },
            games: [
                {
                    id: "0343c99e-bd5e-4887-aa21-94875b8dfba3",
                    status: "closed",
                    coverage: "full",
                    scheduled: "2023-10-24T23:30:00Z",
                    home_points: 119,
                    away_points: 107,
                    track_on_court: true,
                    sr_id: "sr:match:43065361",
                    reference: "0022300061",
                    time_zones: {
                        venue: "US/Mountain",
                        home: "US/Mountain",
                        away: "US/Pacific",
                    },
                    venue: {
                        id: "1a28ef88-76c9-5bcc-b4ee-51d30ca98f4f",
                        name: "Ball Arena",
                        capacity: 19520,
                        address: "1000 Chopper Circle",
                        city: "Denver",
                        state: "CO",
                        zip: "80204",
                        country: "USA",
                        sr_id: "sr:venue:5976",
                        location: {
                            lat: "39.749034",
                            lng: "-105.007604",
                        },
                    },
                    broadcasts: [
                        {
                            network: "TNT",
                            type: "TV",
                            locale: "National",
                            channel: "245",
                        },
                    ],
                    home: {
                        name: "Denver Nuggets",
                        alias: "DEN",
                        id: "583ed102-fb46-11e1-82cb-f4ce4684ea4c",
                        sr_id: "sr:team:3417",
                        reference: "1610612743",
                    },
                    away: {
                        name: "Los Angeles Lakers",
                        alias: "LAL",
                        id: "583ecae2-fb46-11e1-82cb-f4ce4684ea4c",
                        sr_id: "sr:team:3427",
                        reference: "1610612747",
                    },
                },
                {
                    id: "b06ae4da-247e-4696-973a-7f1cbd813fec",
                    status: "closed",
                    coverage: "full",
                    scheduled: "2023-10-25T02:00:00Z",
                    home_points: 104,
                    away_points: 108,
                    track_on_court: true,
                    sr_id: "sr:match:43065363",
                    reference: "0022300062",
                    time_zones: {
                        venue: "US/Pacific",
                        home: "US/Pacific",
                        away: "US/Arizona",
                    },
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
                    broadcasts: [
                        {
                            network: "TNT",
                            type: "TV",
                            locale: "National",
                            channel: "245",
                        },
                    ],
                    home: {
                        name: "Golden State Warriors",
                        alias: "GSW",
                        id: "583ec825-fb46-11e1-82cb-f4ce4684ea4c",
                        sr_id: "sr:team:3428",
                        reference: "1610612744",
                    },
                    away: {
                        name: "Phoenix Suns",
                        alias: "PHX",
                        id: "583ecfa8-fb46-11e1-82cb-f4ce4684ea4c",
                        sr_id: "sr:team:3416",
                        reference: "1610612756",
                    },
                },
            ],
        };

        // Mock Axios response
        axios.get.mockResolvedValueOnce(mockGamesResponse);

        // Mock Game model method 'addAll'
        const addAllMock = jest
            .spyOn(Game, "addAll")
            .mockResolvedValueOnce("Success");

        // Make request to the route
        const response = await request(app)
            .post("/games")
            .set("Authorization", `Bearer ${admin1Token}`);

        // Assert that the request was successful
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual("Success");

        // Assert that the 'addAll' method was called with the correct data
        expect(Game.addAll).toHaveBeenCalledWith(expect.any(Array));

        // Restore the original 'addAll' method
        addAllMock.mockRestore();
    });

    test("should handle errors from SportRadar API", async () => {
        axios.get.mockRejectedValue(new Error("API Error"));

        const response = await request(app)
            .post("/games")
            .set("Authorization", `Bearer ${admin1Token}`);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            error: { message: "API Error", status: 500 },
        });
    });
});

describe("GET /games", () => {
    test("should return game information for a given game ID", async () => {
        const mockBoxScore = [
            { playerId: "player1", points: 20 },
            { playerId: "player2", points: 15 },
        ];
        axios.get.mockResolvedValue({
            data: { home: { players: mockBoxScore } },
        });

        const response = await request(app)
            .get("/games")
            .set("Authorization", `Bearer ${u1Token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            players: [
                { playerId: "player1", points: 20 },
                { playerId: "player2", points: 15 },
            ],
        });
    });

    test("should handle errors from SportRadar API", async () => {
        axios.get.mockRejectedValue(new Error("API Error"));

        const response = await request(app)
            .get("/games")
            .set("Authorization", `Bearer ${u1Token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            error: {
                message: "Error making the request: API Error",
                status: 400,
            },
        });
    });
});
