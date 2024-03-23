const axios = require("axios");
const db = require("../db");
const MockAdapter = require("axios-mock-adapter");
const { updateDailyBoxscores } = require("./boxscore-controller");
const API_KEY = require("../secret/secret");
const Boxscore = require("../models/boxscore");

const mock = new MockAdapter(axios);

afterEach(() => {
    mock.reset();
});

afterAll(() => {
    db.end();
});

describe("updateDailyBoxscores", () => {
    test("should return 'no games played yesterday' when no games were played", async () => {
        mock.onAny().reply(200, { rows: [] });

        const result = await updateDailyBoxscores();

        expect(result).toBe("no games played yesterday");
    });

    test("it should update daily boxscores", async () => {
        const yesterdayGamesResponse = {
            rows: [{ api_id: "gameId1" }, { api_id: "gameId2" }],
        };
        jest.spyOn(db, "query").mockResolvedValueOnce(yesterdayGamesResponse);

        // Mocking the Axios GET requests
        mock.onGet(
            `http://api.sportradar.us/nba/trial/v8/en/games/gameId1/summary.json?api_key=${API_KEY}`
        ).reply(200, {
            away: { id: "teamId1", players: [] },
            home: { players: [] },
        });

        mock.onGet(
            `http://api.sportradar.us/nba/trial/v8/en/games/gameId2/summary.json?api_key=${API_KEY}`
        ).reply(200, {
            away: { players: [] },
            home: { id: "teamId2", players: [] },
        });

        // Mocking the Boxscore model method
        jest.spyOn(Boxscore, "addAll").mockResolvedValueOnce(
            "Mocked insertion"
        );

        // Calling the function
        const result = await updateDailyBoxscores();

        // Assertions
        expect(result).toEqual("Mocked insertion");
        expect(db.query).toHaveBeenCalledTimes(1);
        expect(Boxscore.addAll).toHaveBeenCalledTimes(1);
    });
});
