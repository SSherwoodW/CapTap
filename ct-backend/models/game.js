const db = require("../db");
const { BadRequestError } = require("../expressError");

/** Related functions for games. */

class Game {
    /** Add games to database
     *
     * Requires game array:
     * [
     * { gameId: "game3", homeTeamId: "team1", awayTeamId: "team2", scheduled: "2024-01-01", },
     * { gameId: "game4", homeTeamId: "team3", awayTeamId: "team2", scheduled: "2024-01-02", }
     * ]
     *
     * Returns { success: true, message: "Games added successfully." }
     *
     * Throws BadRequestError if there are no games to add or the game data is invalid.
     *
     */

    static async addAll(gameData) {
        try {
            const insertQueries = gameData.map((game) => {
                return db.query(
                    `INSERT INTO games
                    (api_id, team_1_id, team_2_id, game_date)
                    VALUES ($1, $2, $3, $4)`,
                    [
                        game.gameId,
                        game.homeTeamId,
                        game.awayTeamId,
                        game.scheduled,
                    ]
                );
            });

            // execute all insert queries
            await Promise.all(insertQueries);

            return { success: true, message: "Games added successfully." };
        } catch (err) {
            throw new BadRequestError("Unable to add games.");
        }
    }

    /** Get games played by specific player from database
     *
     * Requires: playerId(integer)
     * Optional: limit(integer) to get specified number of games
     *
     * Returns array of objects: [ {api_id, game_date}, {api_id, game_date}, ... ]
     *
     * Throws BadRequestError if no games were found.
     */

    static async playerGames(playerId, limit) {
        try {
            const playerExists = await db.query(
                `SELECT id FROM players WHERE id = $1`,
                [playerId]
            );

            if (playerExists.rows.length === 0) {
                throw new BadRequestError("Player not found.");
            }

            let gameIds;
            if (Number.isInteger(limit)) {
                gameIds = await db.query(
                    `SELECT g.api_id, g.game_date
                        FROM games g
                        JOIN teams t1 On g.team_1_id = t1.api_id
                        JOIN teams t2 ON g.team_2_id = t2.api_id
                        JOIN players p ON (p.team_id = t1.api_id OR p.team_id = t2.api_id)
                        WHERE p.id = $1
                        AND g.game_date < CURRENT_DATE
                        ORDER BY g.game_date DESC
                        LIMIT $2`,
                    [playerId, limit]
                );
            } else {
                gameIds = await db.query(
                    `SELECT g.api_id, g.game_date
                        FROM games g
                        JOIN teams t1 On g.team_1_id = t1.api_id
                        JOIN teams t2 ON g.team_2_id = t2.api_id
                        JOIN players p ON (p.team_id = t1.api_id OR p.team_id = t2.api_id)
                        WHERE p.id = $1
                        AND g.game_date < CURRENT_DATE
                        ORDER BY g.game_date DESC
                        LIMIT ALL`,
                    [playerId]
                );
            }

            if (gameIds.rows.length === 0) {
                return [];
            }

            return gameIds.rows;
        } catch (err) {
            throw new BadRequestError("No games found for that player.");
        }
    }

    /** Get game IDs from database for specified team.
     *
     * Requires: teamId -- team 'api_id'
     *
     * Returns array of gameIds, or empty array if no games for that team.
     *
     * If !teamId, badrequesterror.
     *
     */

    static async team(teamId) {
        if (!teamId) throw new BadRequestError("teamId required");
        try {
            const teamExists = await db.query(
                `SELECT id FROM teams WHERE api_id = $1`,
                [teamId]
            );

            if (teamExists.rows.length === 0) {
                throw new BadRequestError("Team not found.");
            }

            let result = await db.query(
                `SELECT api_id
            FROM games
            WHERE team_1_id = $1 OR team_2_id = $1`,
                [teamId]
            );

            if (result.rows.length === 0) {
                return [];
            }

            return result.rows;
        } catch (err) {
            throw new BadRequestError(
                `Error fetching games for team: ${teamId}`
            );
        }
    }
}

module.exports = Game;
