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
     *  booker api id : 31baa84f-c759-4f92-8e1f-a92305ade3d6
     * booker team_id : 583ecfa8-fb46-11e1-82cb-f4ce4684ea4c
     *
     */

    static async find(playerId) {
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
    }

    /** Get statlogs for players
     *
     *
     */
}

module.exports = Boxscore;
