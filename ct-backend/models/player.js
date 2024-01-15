const db = require("../db");
const natural = require("natural");

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

let regularSeasonId = "f1162fd1-29c5-4c29-abb4-57b78f16d238";
let playInTournamentId = "851f97e4-c830-4590-88e9-e1286383148c";
let postSeasonId = "8905ddd2-e5f0-4734-b9ef-c9c3452b72d2";

/** Related functions for players. */

class Player {
    /** Add players to database
     *
     *
     */
    static async addAll(playerData) {
        try {
            const insertQueries = playerData.map((player) => {
                return db.query(
                    `INSERT INTO players
                    (api_id, first_name, last_name, full_name, season_id, team_id)
                    VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        player.playerId,
                        player.firstName,
                        player.lastName,
                        player.fullName,
                        regularSeasonId,
                        player.teamId,
                    ]
                );
            });

            console.log(insertQueries);

            // execute all insert queries
            await Promise.all(insertQueries);

            return { success: true, message: "Players added successfully." };
        } catch (err) {
            throw new BadRequestError("unable to add players.");
        }
    }

    static async find(id) {
        let parsedId = parseInt(id);

        let result = await db.query(`SELECT * FROM players WHERE id = $1`, [
            parsedId,
        ]);

        return result.rows;
    }

    static async findBy(criteria) {
        try {
            const { id, apiId, firstName, lastName, fullName } = criteria;

            let query = "SELECT * FROM players WHERE";
            const values = [];

            if (id) {
                query += " id = $1";
                values.push(id);
            } else if (apiId) {
                query += " api_id = $1 ";
                values.push(apiId);
            } else if (firstName) {
                query += " first_name ILIKE $1";
                values.push(`%${firstName}%`);
            } else if (lastName) {
                query += " last_name ILIKE $1";
                values.push(`%${lastName}%`);
            } else if (fullName) {
                query += " full_name ILIKE $1";
                values.push(`%${fullName}%`);
            } else {
                return { success: false, message: "Invalid criteria" };
            }

            const result = await db.query(query, values);
            return result.rows;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }
}

module.exports = Player;
