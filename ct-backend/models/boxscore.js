"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Boxscore {
    /** Add boxscores to database
     *
     * Requires array of player boxscores objects [{boxscore}, {boxscore}]
     *
     * Returns {success: true, message: "Boxscores added successfully."}
     *
     * Throws BadRequestError if unable to add boxscores.
     */

    static async addAll(boxScoreData) {
        try {
            const insertQueries = boxScoreData.map((player) => {
                return db.query(
                    `INSERT INTO boxscores
                    (player_id, game_id, minutes, points, rebounds, assists, steals, blocks, turnovers, three_points_made, three_points_attempted)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                    [
                        player.playerId,
                        player.gameId,
                        player.minutes,
                        player.points,
                        player.rebounds,
                        player.assists,
                        player.steals,
                        player.blocks,
                        player.turnovers,
                        player.threePointsMade,
                        player.threePointsAttempted,
                    ]
                );
            });

            console.log(insertQueries);

            await Promise.all(insertQueries);

            return { success: true, message: "Boxscores added successfully." };
        } catch (err) {
            throw new BadRequestError("Unable to add boxscores", err);
        }
    }

    /** Find boxscores for player(s)
     *
     * Requires player api_id
     *
     * Returns array of boxscores
     *
     */

    static async find(playerId) {
        try {
            console.log(playerId);
            const playerExists = await db.query(
                `SELECT * FROM players
                WHERE api_id = $1`,
                [playerId]
            );
            if (playerExists.rows.length === 0)
                throw new BadRequestError("no player with id", playerId);
            const result = await db.query(
                `SELECT 
            b.minutes, 
            b.points, 
            b.rebounds, 
            b.assists, 
            b.steals, 
            b.blocks, 
            b.turnovers, 
            b.three_points_made AS threePointsMade, 
            b.three_points_attempted AS threePointsAttempted, 
            g.game_date AS gameDate,
            CASE
                WHEN p.team_id != g.team_1_id THEN t1.name
                ELSE t2.name
            END AS opposing_team
            FROM boxscores b
            JOIN games g ON b.game_id = g.api_id
            JOIN players p ON b.player_id = p.api_id
            JOIN teams t1 ON g.team_1_id = t1.api_id
            JOIN teams t2 ON g.team_2_id = t2.api_id
            WHERE (g.team_1_id = p.team_id OR g.team_2_id = p.team_id)
            AND player_id = $1
            AND g.game_date < CURRENT_DATE
            ORDER BY g.game_date DESC`,
                [playerId]
            );

            return result.rows;
        } catch (err) {
            throw new NotFoundError("no boxscores found for player", playerId);
        }
    }
}

module.exports = Boxscore;
