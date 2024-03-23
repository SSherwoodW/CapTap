const axios = require("axios");
const express = require("express");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const {
    parsePlayerData,
    getPlayerData,
    parseBoxScoreData,
} = require("../helpers/api");
const { updateDailyBoxscores } = require("../helpers/boxscore-controller");
const { BadRequestError } = require("../expressError");

const Player = require("../models/player");
const Team = require("../models/team");
const Game = require("../models/game");
const Boxscore = require("../models/boxscore");

const router = express.Router();

const { API_KEY } = require("../secret/secret");

/** POST / { } =>
 *
 * Gets all players from all teams using team_id
 *
 * Adds all players to the database as {id, api_id, first_name, last_name, full_name, season_id}
 *
 * ** CURRENTLY LIMITED BY TRIAL SPORTRADAR API KEY, so I'm iterating through the teamApiIds one at a time.
 *
 * Authentication required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const teams = await Team.findAll();
        let teamApiIds = teams.map((team) => team.apiid);
        console.log(teamApiIds[0]);

        const playerData = [];

        /** Will use this fxn when no longer rate-limited **/

        // for (const teamId of teamApiIds) {
        //     const data = await getPlayerData(teamId);
        //     playerData.push(data);
        // }

        let players = await axios.get(
            `http://api.sportradar.us/nba/trial/v8/en/teams/${teamApiIds[0]}/profile.json?api_key=${API_KEY}`
        );

        playerData.push(players.data);
        console.log(playerData);

        const flattenedPlayerData = [].concat(...playerData);
        console.log(flattenedPlayerData);

        let playersData = parsePlayerData(flattenedPlayerData);

        let dBInsertion = await Player.addAll(playersData);
        return res.json(dBInsertion);
    } catch (err) {
        return next(err);
    }
});

/** POST /boxscores
 *
 * Requires team API id
 *
 * Adds all player boxscores up to this date into the DB
 *
 * ** CURRENTLY RATE LIMITED BY API. I will adjust the function to run all teams when I have full API privileges.
 * ** As of now, I manually added all the Phoenix Suns boxscores.
 */

router.post("/boxscores", ensureAdmin, async function (req, res, next) {
    try {
        let phxId = "583ecfa8-fb46-11e1-82cb-f4ce4684ea4c";
        let games = await Game.team(phxId);

        let gameIds = games.map((game) => game.api_id);

        const boxScore = await axios.get(
            `http://api.sportradar.us/nba/trial/v8/en/games/${gameIds[38]}/summary.json?api_key=${API_KEY}`
        );

        let phxBoxScore;

        if (boxScore.data.away.id === phxId) {
            phxBoxScore = boxScore.data.away.players;
        } else {
            phxBoxScore = boxScore.data.home.players;
        }

        const phxBoxScoreWithGameId = {
            gameId: gameIds[38],
            players: phxBoxScore,
        };

        const parsedBoxScoreData = parseBoxScoreData(
            gameIds[38],
            phxBoxScoreWithGameId
        );
        console.log(parsedBoxScoreData);

        let dbInsertion = await Boxscore.addAll(parsedBoxScoreData);

        return res.json(dbInsertion);
    } catch (err) {
        return next(err);
    }
});

/** GET / { } => { id, apiId, firstName, lastName, fullName}
 *
 * Can provide search filter in query:
 * - name (full, first, or last -- will find partial and case-insensitive matches)
 *
 * Returns { "players": [ {id, api_id, first_name, last_name, season_id, team_id}, {...}, {} ] }
 *
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
    try {
        let criteria = {};
        let players;

        console.log(req.query);

        if (!req.query.full_name) {
            players = await Player.findBy(criteria);
            return res.json({ players });
        } else {
            const nameCriteria = req.query.full_name;

            if (nameCriteria.includes(" ")) {
                const [firstName, lastName] = nameCriteria.split(" ");
                criteria.firstName = firstName;
                criteria.lastName = lastName;
            } else {
                criteria.fullName = nameCriteria;
            }
        }

        players = await Player.findBy(criteria);

        return res.json({ players });
    } catch (err) {
        return next(err);
    }
});

/** GET /[id]
 *
 * Requires player id (captap db id)
 *
 * Returns player information, including game log
 *
 * Authentication required: logged in user
 */

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        let player = await Player.find(req.params.id);
        console.log("In route:", player.apiid);
        const playerId = player.apiid;
        console.log(playerId);

        const boxscores = await Boxscore.find(playerId);

        player["boxscores"] = boxscores;
        console.log("player", player);

        return res.json({ player });
    } catch (err) {
        return next(err);
    }
});

/** GET /gamelog
 *
 * Requires player ID & boxscores requested [L5, L10, season] (req body)
 *
 * Returns { boxscores: [ {boxscore}, {boxscore}, {boxscore}, ...] }
 *
 * Authentication required: logged in user
 */

// router.post("/gamelog", ensureLoggedIn, async function (req, res, next) {
//     try {
//         const newBoxScore = await updateDailyBoxscores();

//         return res.json({ newBoxScore });
//     } catch (err) {
//         return next(err);
//     }
// });

module.exports = router;
