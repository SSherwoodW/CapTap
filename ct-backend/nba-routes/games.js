const axios = require("axios");
const express = require("express");
const {
    ensureCorrectUserOrAdmin,
    ensureAdmin,
    ensureLoggedIn,
} = require("../middleware/auth");
const { parseGameData } = require("../helpers/api");
const { API_KEY } = require("../secret");
const { BadRequestError } = require("../expressError");

const Game = require("../models/game");

const router = express.Router();

const gameId = "0343c99e-bd5e-4887-aa21-94875b8dfba3"; // REPLACE WITH GAME ID -- HOW DO I MAKE THIS A FUNCTION...

// Single game summary endpoint
const summaryUrl = `https://api.sportradar.us/nba/trial/v8/en/games/${gameId}/summary.json?api_key=${API_KEY}`;

/** POST / {} => {  }
 *
 * Gets full NBA schedule from SportRadar API.
 *
 * Extracts {id, home.id, away.id, scheduled } from each game data point.
 *
 * Adds all 1230 games to database as {id, api_id, team_1_id, team_2_id, game_date}
 *  WHERE api_id = game.id
 *        team_1_id = game.home.id
 *        team_2_id = game.away.id
 *        game_date = scheduled
 *
 * Returns success/failure message upon DB insertion.
 *
 * ** This should be a ONCE-YEARLY action to populate the DB. **
 *
 */

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const response = await axios.get(
            `https://api.sportradar.com/nba/trial/v8/en/games/2023/REG/schedule.json?api_key=${API_KEY}`
        );

        const games = parseGameData(response);

        let dBInsertion = await Game.addAll(games);
        res.json(dBInsertion);
    } catch (err) {
        return next(err);
    }
});

/** GET / {gameID} => { single game information}
 *
 * Requires game ID.
 *
 * Returns information about that game, including a full box score.
 *
 * Authentication: logged in user.
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const response = await axios.get(summaryUrl);
        const boxScore = response.data.home.players;
        console.log(boxScore);
        res.json(response.data.home);
    } catch (error) {
        next(new BadRequestError(`Error making the request: ${error.message}`));
    }
});

module.exports = router;
