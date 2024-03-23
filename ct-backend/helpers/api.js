const axios = require("axios");
const API_KEY = require("../secret/secret");

const { BadRequestError } = require("../expressError");

/**
 *
 * @param {Object} data: data is an response object from external API.
 *              {data: {conferences: {divisions: {id, market, name, alias [[for ALL TEAMS]]}}}}
 * @returns {Object} teamsData : [{id, name, code}, {...}, ...]
 */
function parseTeamData(data) {
    const teamsData = [];

    // not working for tests: if (data && data.data && data.data.conferences)
    if (data && data.conferences) {
        data.conferences.forEach((conference) => {
            conference.divisions.forEach((division) => {
                if (division.teams) {
                    division.teams.forEach((team) => {
                        if (team.id && team.market && team.name && team.alias) {
                            const combinedName = `${team.market} ${team.name}`;
                            teamsData.push({
                                id: team.id,
                                name: combinedName,
                                code: team.alias,
                            });
                        }
                    });
                }
            });
        });
    } else {
        throw new BadRequestError("No data");
    }

    return teamsData;
}

/**
 *
 * @param {*} dataArray: array of objects with team & player data [{{}}, players: [{}, {}]]
 * @returns {Object} playersData array of playerData objects used for DB Insertion
 *          [
 *           {teamId , playerId, fullName, firstName, lastName },
 *           {teamId , playerId, fullName, firstName, lastName },
 *           ...
 *          ]
 */
function parsePlayerData(dataArray) {
    const playersData = [];

    if (Array.isArray(dataArray)) {
        dataArray.forEach((data) => {
            if (data && data.players) {
                const teamId = data.id;
                data.players.forEach((player) => {
                    if (
                        player.id &&
                        player.full_name &&
                        player.first_name &&
                        player.last_name
                    ) {
                        playersData.push({
                            teamId: teamId,
                            playerId: player.id,
                            fullName: player.full_name,
                            firstName: player.first_name,
                            lastName: player.last_name,
                        });
                    }
                });
            }
        });
    } else {
        throw new BadRequestError("No player data");
    }

    return playersData;
}

/**
 *
 * @param {Object} data: JSON response object from SportRadar API.
 * @returns array of game objects with data for DB Insertion
 *          [
 *              {gameId, scheduled, homeTeamId, awayTeamId},
 *              {gameId, scheduled, homeTeamId, awayTeamId},
 *              ...
 *          ]
 */

function parseGameData(data) {
    const gamesData = [];

    // not working for test: (data && data.data && data.data.games && data.data.games.length > 0)

    if (data && data.games && data.games.length > 0) {
        console.log("parseGameData", data.games[0].home);
        // also changed for test: data.data.games.forEach((game) => {
        data.games.forEach((game) => {
            if (
                game.id &&
                game.scheduled &&
                game.home &&
                game.home.id &&
                game.away &&
                game.away.id
            ) {
                gamesData.push({
                    gameId: game.id,
                    scheduled: game.scheduled,
                    homeTeamId: game.home.id,
                    awayTeamId: game.away.id,
                });
            } else {
                throw new BadRequestError("Error fetching game data");
            }
        });
    } else {
        throw new BadRequestError("No game data");
    }
    console.log(gamesData);
    return gamesData;
}

function parseBoxScoreData(gameId, data) {
    console.log("Inside parseBoxScoreData:", data.players);
    if (data && data.gameId && data.players) {
        return data.players.map((player) => ({
            playerId: player.id,
            gameId: gameId,
            minutes: player.statistics.minutes,
            points: player.statistics.points,
            rebounds: player.statistics.rebounds,
            assists: player.statistics.assists,
            steals: player.statistics.steals,
            blocks: player.statistics.blocks,
            turnovers: player.statistics.turnovers,
            threePointsMade: player.statistics.three_points_made,
            threePointsAttempted: player.statistics.three_points_att,
        }));
    } else {
        throw new BadRequestError(
            "Inside parseBoxScoreData: no boxscore data."
        );
    }
}

/**
 *
 * @param {*} teamId is a team's api_id from the DB.
 * @returns {Object} players.data is a JSON response from SportRadar API
 */
async function getPlayerData(teamId) {
    try {
        let players = await axios.get(
            `http://api.sportradar.us/nba/trial/v8/en/teams/${teamId}/profile.json?api_key=${API_KEY}`
        );

        return players.data;
    } catch (err) {
        console.error(`Error fetching data for team ${teamId}:`, err.message);
        return { error: `Unable to fetch data for team ${teamId}` };
    }
}

module.exports = {
    parseTeamData,
    parsePlayerData,
    parseGameData,
    getPlayerData,
    parseBoxScoreData,
};
