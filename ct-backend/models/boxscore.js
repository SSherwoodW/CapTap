"use strict";

const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

class Boxscore {
    /** Add boxscores to database
     *
     *
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
            throw new BadRequestError("Unable to add boxscores");
        }
    }

    /** Find boxscores for player(s)
     *
     *
     */

    static async find(playerId) {
        const result = await db.query(
            `SELECT b.*, g.game_date FROM boxscores b
            JOIN games g ON b.game_id = g.api_id
            WHERE player_id = $1
            AND g.game_date < CURRENT_DATE
            ORDER BY g.game_date DESC`,
            [playerId]
        );

        return result.rows;
    }

    /** Get statlogs for players
     *
     *
     */
}

module.exports = Boxscore;
