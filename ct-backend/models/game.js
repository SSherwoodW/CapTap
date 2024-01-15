const db = require("../db");

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

/** Related functions for games. */

class Game {
    /** Add games to database
     *
     *
     */

    static async addAll(gameData) {
        try {
            const insertQueries = gameData.map((game) => {
                console.log(game.scheduled);
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

    static async playerGames(playerId, limit) {
        // let limitor;
        // if (Number.isInteger(limit)) {
        //     limitor = limit;
        // } else {
        //     limitor = ALL;
        // }
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

        return gameIds.rows;
    }

    static async team(teamId) {
        let result = await db.query(
            `SELECT api_id
            FROM games
            WHERE team_1_id = $1 OR team_2_id = $1`,
            [teamId]
        );

        return result.rows;
    }
}

module.exports = Game;
