const axios = require("axios");
const express = require("express");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { parseTeamData } = require("../helpers/api");

const Team = require("../models/team");

const router = express.Router();

const { API_KEY } = require("../secret/secret");

const apiUrl = `https://api.sportradar.us/nba/trial/v8/en/`;

let teams;

/** POST /
 *
 * Requests JSON data on all NBA teams from SportRadar API
 *
 * Gets [ {api_id, name, code}, {api_id, name, code }, ... ]
 *
 * Adds all teams to DB as {id, api_id, name, code }
 *
 * ** This should be a ONE-TIME action to populate the DB. **
 *
 */

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const response = await axios.get(
            `${apiUrl}/league/hierarchy.json?api_key=${API_KEY}`
        );
        console.log(response);
        teams = parseTeamData(response);
        console.log(teams);
        let dBInsertion = await Team.addAll(teams);
        return res.json(dBInsertion);
    } catch (err) {
        return next(err);
    }
});

/** GET /teams {  } => { id, api_id, name, code }
 *
 * No request requirements
 *
 * Returns { teams: [ {id, apiId, name, code }, {id, apiId, name, code }, ... ]}
 *
 * Authorization required: logged-in user.
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const teams = await Team.findAll();
        console.log(teams);
        return res.json({ teams });
    } catch (err) {
        return next(err);
    }
});

/** GET /teams/[criteria] { criteria } => { id, api_id, name, code, players: [ {code, id, api_id, first_name, last_name, season_id, team_id },{...}] }
 *
 * Requires search criteria in URL params.
 * Can request by id, api_id, name (partial match accepted), or team code.
 *
 * Returns { team: {id, api_id, name, code, players} }
 *
 * Authorization required: logged-in user.
 */

router.get("/:criteria", ensureLoggedIn, async function (req, res, next) {
    try {
        let criteria = {};

        if (!isNaN(req.params.criteria)) {
            criteria.id = parseInt(req.params.criteria);
        } else if (
            req.params.criteria.length > 1 &&
            req.params.criteria.length <= 3
        ) {
            criteria.code = req.params.criteria.toUpperCase();
        } else if (req.params.criteria.length > 30) {
            criteria.apiId = req.params.criteria;
        } else {
            criteria.name = req.params.criteria;
        }
        console.log(criteria);
        const team = await Team.findBy(criteria);
        console.log(team);

        const roster = await Team.getRoster(team.api_id);
        team["players"] = roster;

        return res.json({ team });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
