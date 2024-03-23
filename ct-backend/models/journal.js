"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

/** Related functions for journal entries. */

class Journal {
    /** Create journal entry with data.
     *
     * Requires {userId, data}
     *
     * Returns { id, username, description }
     *
     * Throws BadRequestError on post failure.
     **/

    static async post(userId, data) {
        try {
            const { description, range, journalPlayersData } = data;
            console.log(range, description, journalPlayersData);

            const journalResult = await db.query(
                `INSERT INTO journals (user_id, description, range)
           VALUES ($1, $2, $3)
           RETURNING id, description, range, created_at`,
                [userId, description, range]
            );

            const journalEntry = journalResult.rows[0];
            console.log(journalEntry);

            if (!journalEntry)
                throw BadRequestError(`Unable to post journal entry.`);

            const playerInsertPromises = journalPlayersData.map(
                async (playerData) => {
                    const { playerId, statCategory, overUnder, value } =
                        playerData;

                    console.log(playerId, statCategory, overUnder, value);
                    const playerResult = await db.query(
                        `INSERT INTO journal_players (journal_id, player_id, stat_category, over_under, value)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING journal_id, player_id, stat_category, over_under, value`,
                        [
                            journalEntry.id,
                            playerId,
                            statCategory,
                            overUnder,
                            value,
                        ]
                    );
                    return playerResult.rows[0];
                }
            );

            const journalPlayerEntries = await Promise.all(
                playerInsertPromises
            );
            console.log("journalPlayerEntries", playerInsertPromises);

            return {
                ...journalEntry,
                journalPlayersData: journalPlayerEntries,
            };
        } catch (err) {
            console.log("err", err);
            throw new BadRequestError("unable to add journal entry");
        }
    }

    /** Get a specific journal entry
     *
     * Requires journalId
     *
     * Returns { entry: {userId, description, createdAt }}
     */

    static async find(journalId) {
        try {
            const result = await db.query(
                `SELECT j.id,
                    j.user_id AS userId,
                    j.description,
                    j.range,
                    j.created_at AS createdAt,
                    jp.player_id,
                    jp.stat_category,
                    jp.over_under,
                    jp.value
            FROM journals j
            LEFT JOIN journal_players jp ON j.id = jp.journal_id
            WHERE j.id = $1`,
                [journalId]
            );

            if (!result.rows.length)
                throw new NotFoundError(
                    `Journal entry with ID ${journalId} not found.`
                );

            const groupedData = result.rows.reduce((acc, row) => {
                if (!acc.id) {
                    acc.id = row.id;
                    acc.userId = row.userid;
                    acc.description = row.description;
                    acc.range = row.range;
                    acc.createdAt = row.createdat;
                    acc.journalPlayersData = [];
                }
                if (row.player_id) {
                    acc.journalPlayersData.push({
                        playerId: row.player_id,
                        statCategory: row.stat_category,
                        overUnder: row.over_under,
                        value: row.value,
                    });
                }
                return acc;
            }, {});

            return groupedData;
        } catch (err) {
            throw new NotFoundError(
                `Journal entry with ID ${journalId} not found.`
            );
        }
    }

    /** Get all entries from all users
     *
     * No params
     *
     * Returns { entries: [ { entry }, { entry }, { entry }...] }
     */

    static async findAll() {
        try {
            const result = await db.query(
                `SELECT j.id,
                    j.user_id AS userId,
                    j.description,
                    j.range,
                    j.created_at AS createdAt,
                    jp.player_id,
                    jp.stat_category,
                    jp.over_under,
                    jp.value
            FROM journals j
            LEFT JOIN journal_players jp ON j.id = jp.journal_id
            ORDER BY created_at`
            );

            if (!result.rows.length)
                throw new NotFoundError(`No journal entries found.`);

            const groupedData = {};

            result.rows.forEach((row) => {
                const journalId = row.id;
                if (!groupedData[journalId]) {
                    groupedData[journalId] = {
                        id: journalId,
                        userId: row.userid,
                        description: row.description,
                        range: row.range,
                        createdAt: row.createdat,
                        journalPlayersData: [],
                    };
                }
                if (row.player_id) {
                    groupedData[journalId].journalPlayersData.push({
                        playerId: row.player_id,
                        statCategory: row.stat_category,
                        overUnder: row.over_under,
                        value: row.value,
                    });
                }
            });

            return Object.values(groupedData);
        } catch (err) {
            throw new NotFoundError("unable to find any journal entries.");
        }
    }

    /** Get all entries from a single user
     *
     * Requires {userId}
     *
     * Returns { entries: [ { entry }, { entry }, { entry }...] }
     *
     * Throws NotFoundError if not found.
     */

    static async findUserEntries(username) {
        try {
            const result = await db.query(
                `SELECT j.id,
                    j.user_id AS userId,
                    j.description,
                    j.range,
                    j.created_at AS createdAt,
                    jp.player_id,
                    jp.stat_category,
                    jp.over_under,
                    jp.value
            FROM journals j
            LEFT JOIN journal_players jp ON j.id = jp.journal_id
            JOIN users u ON j.user_id = u.id
            WHERE u.username = $1
            ORDER BY created_at`,
                [username]
            );

            if (!result.rows.length)
                throw new NotFoundError(`No journal entries found.`);

            const groupedData = {};

            result.rows.forEach((row) => {
                const journalId = row.id;
                if (!groupedData[journalId]) {
                    groupedData[journalId] = {
                        id: journalId,
                        userId: row.userid,
                        description: row.description,
                        range: row.range,
                        createdAt: row.createdAt,
                        journalPlayersData: [],
                    };
                }

                if (row.player_id) {
                    groupedData[journalId].journalPlayersData.push({
                        playerId: row.player_id,
                        statCategory: row.stat_category,
                        overUnder: row.over_under,
                        value: row.value,
                    });
                }
            });

            return Object.values(groupedData);
        } catch (err) {
            throw new NotFoundError(`No journal entries found.`);
        }
    }

    /** Update journal entry [description]
     *
     * The only possible update for journal entries is 'description'.
     *
     * Requires { userId, description }
     *
     * Returns { userId, description, createdAt }
     *
     * Throws BadRequestError if entry is not updated.
     *
     */

    static async update(journalId, description) {
        try {
            const journalExists = await db.query(
                `SELECT * FROM journals WHERE id = $1`,
                [journalId]
            );

            if (journalExists.rows.length === 0)
                throw new BadRequestError("No journal entries with that id");

            const result = await db.query(
                `UPDATE journals
                SET description = $1
                WHERE id = $2
                RETURNING user_id AS userId, description, created_at AS createdAt`,
                [description, journalId]
            );

            if (!result.rows)
                throw new BadRequestError("Entry not updated:", journalId);

            return result.rows;
        } catch (err) {
            throw new BadRequestError("Entry not updated:", journalId);
        }
    }

    /** Delete journal entry */

    static async delete(journalId) {
        try {
            const res = await db.query(
                `DELETE FROM journals
                WHERE id = $1`,
                [journalId]
            );
            return "Journal entry deleted.";
        } catch (err) {
            throw new BadRequestError("Unable to delete journal entry");
        }
    }
}

module.exports = Journal;
