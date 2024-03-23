const db = require("../db");

const { NotFoundError, BadRequestError } = require("../expressError");

/* Related functions for teams. */

class Team {
    /** Add teams to database
     *
     * Requires [ {api id, name, code}, {api id, name, code}, ...]
     *
     * Returns either a success or a failure message
     */

    static async addAll(teamData) {
        try {
            const insertQueries = teamData.map((team) => {
                return db.query(
                    `INSERT INTO teams (api_id, name, code) VALUES ($1, $2, $3)`,
                    [team.id, team.name, team.code]
                );
            });

            // execute all insert queries
            await Promise.all(insertQueries);

            return { success: true, message: "Teams added successfully." };
        } catch (err) {
            throw new BadRequestError("Unable to add teams.");
        }
    }

    /** Get all teams
     *
     * No params
     *
     * Returns { teams: }
     */

    static async findAll() {
        const result = await db.query(
            `SELECT id,
            api_id AS apiId,
            name,
            code
            FROM teams
            ORDER BY name`
        );

        const teams = result.rows;

        if (!teams) throw new NotFoundError("Unable to find teams.");

        return result.rows;
    }

    /** Get a specific team
     *
     * Requires
     *
     */

    static async findBy(criteria) {
        try {
            const { id, apiId, name, code } = criteria;

            let query = "SELECT * FROM teams WHERE";
            const values = [];

            if (id) {
                query += " id = $1";
                values.push(id);
            } else if (apiId) {
                query += " api_id = $1 ";
                values.push(apiId);
            } else if (name) {
                query += " name ILIKE $1";
                values.push(`%${name}%`);
            } else if (code) {
                query += " code = $1";
                values.push(code);
            } else {
                return { success: false, message: "Invalid criteria" };
            }

            const result = await db.query(query, values);

            if (result.rows.length === 0) {
                throw new NotFoundError("No team found matching that criteria");
            }
            return result.rows[0];
        } catch (err) {
            throw new NotFoundError("no team found matching that criteria");
        }
    }

    static async getRoster(apiId) {
        const result = await db.query(
            `SELECT t.code, p.id, p.api_id, p.full_name FROM teams t
            JOIN players p ON t.api_id = p.team_id
            WHERE p.team_id = $1`,
            [apiId]
        );

        if (result.rows.length === 0)
            throw new NotFoundError("Unable to find players for team:", apiId);

        const roster = result.rows;

        return roster;
    }
}

module.exports = Team;
