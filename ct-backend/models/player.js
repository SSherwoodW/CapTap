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

        let playerRes = await db.query(
            `SELECT p.api_id AS apiId, p.full_name AS fullName, t.name 
            FROM players p
            JOIN teams t
            ON p.team_id = t.api_id
            WHERE p.id = $1`,
            [parsedId]
        );

        let player = playerRes.rows[0];

        const teammatesRes = await db.query(
            `SELECT * FROM players
            WHERE team_id = 
            (SELECT team_id FROM players WHERE api_id = $1)`,
            [player.apiid]
        );

        const teammates = teammatesRes.rows;

        if (!teammates) throw new NotFoundError("No players found.");

        player.teammates = teammates;

        return player;
    }

    static async findBy(criteria) {
        try {
            console.log(criteria);
            if (Object.keys(criteria).length === 0) {
                // No search criteria provided, fetch all players
                const allPlayersQuery =
                    "SELECT p.id, p.full_name AS Name, t.code AS teamCode FROM players p JOIN teams t ON p.team_id = t.api_id";
                const allPlayersResult = await db.query(allPlayersQuery);
                return allPlayersResult.rows;
            }

            const { firstName, lastName, fullName } = criteria;

            let query =
                "SELECT p.id, p.full_name AS Name, t.code AS teamCode FROM players p JOIN teams t ON p.team_id = t.api_id WHERE";
            const values = [];

            if (firstName) {
                query += " p.first_name ILIKE $1";
                values.push(`%${firstName}%`);
            } else if (lastName) {
                query += " p.last_name ILIKE $1";
                values.push(`%${lastName}%`);
            } else if (fullName) {
                query += " p.full_name ILIKE $1";
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

    static async getTeammates(apiId) {
        const teammatesRes = await db.query(
            `SELECT * FROM players
            WHERE team_id = 
            (SELECT team_id FROM players WHERE api_id = $1)`,
            [apiId]
        );

        const teammates = teammatesRes.rows[0];

        if (!teammates) throw new NotFoundError("No players found.");
    }
}

module.exports = Player;
