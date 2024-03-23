"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
    /** authenticate user with username, password.
     *
     * Returns { username, first_name, last_name, email, birthdate, is_admin }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/

    static async authenticate(username, password) {
        // try to find the user first
        const result = await db.query(
            `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
            [username]
        );

        const user = result.rows[0];

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }

    /** Register user with data.
     *
     * Returns { username, firstName, lastName, email, isAdmin }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async register({
        username,
        password,
        firstName,
        lastName,
        email,
        birthdate,
        isAdmin,
    }) {
        const duplicateCheck = await db.query(
            `SELECT username
           FROM users
           WHERE username = $1`,
            [username]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            birthdate,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
            [
                username,
                hashedPassword,
                firstName,
                lastName,
                email,
                birthdate,
                isAdmin,
            ]
        );

        const user = result.rows[0];

        return user;
    }

    /** Find all users.
     *
     * Returns [{ username, first_name, last_name, email, is_admin }, ...]
     **/

    static async findAll() {
        const result = await db.query(
            `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           ORDER BY username`
        );

        return result.rows;
    }

    /** Given a username, return data about user.
     *
     * Returns { username, first_name, last_name, is_admin, followers, following }
     *
     *
     * Throws NotFoundError if user not found.
     **/

    static async get(username) {
        const userRes = await db.query(
            `SELECT id,
                  username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
            [username]
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        return user;
    }

    /** Update user data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { firstName, lastName, password, email, isAdmin }
     *
     * Returns { username, firstName, lastName, email, isAdmin }
     *
     * Throws NotFoundError if not found.
     *
     * WARNING: this function can set a new password or make a user an admin.
     * Callers of this function must be certain they have validated inputs to this
     * or a serious security risks are opened.
     */

    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(
                data.password,
                BCRYPT_WORK_FACTOR
            );
        }

        const { setCols, values } = sqlForPartialUpdate(data, {
            firstName: "first_name",
            lastName: "last_name",
            isAdmin: "is_admin",
        });
        const usernameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;
        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        delete user.password;
        return user;
    }

    /** Delete given user from database; returns undefined. */

    static async remove(username) {
        let result = await db.query(
            `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
            [username]
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);
    }

    // /** Get a list of all users following a user.
    //  *
    //  * Data returned is a list of all a user's followers by username.
    //  *
    //  */

    // static async followers(userId) {
    //     let result = await db.query(
    //         `SELECT u.username
    //         FROM users u
    //         JOIN follows f
    //         ON f.follower_id = u.id
    //         WHERE f.followed_user_id = $1`,
    //         [userId]
    //     );

    //     return result.rows;
    // }

    // /** Get a list of all users following a user.
    //  *
    //  * Data returned is a list of all a user's followers by username.
    //  *
    //  */

    // static async following(userId) {
    //     let result = await db.query(
    //         `SELECT u.username
    //         FROM users u
    //         JOIN follows f
    //         ON f.followed_user_id = u.id
    //         WHERE f.follower_id = $1`,
    //         [userId]
    //     );

    //     return result.rows;
    // }

    // static async follow(following_user, followed_user) {
    //     try {
    //         // Check if the users exist and get their IDs
    //         const followingUser = await db.query(
    //             `SELECT id FROM users WHERE username = $1`,
    //             [following_user]
    //         );

    //         const followedUser = await db.query(
    //             `SELECT id FROM users WHERE username = $1`,
    //             [followed_user]
    //         );

    //         // Check if both users exist
    //         if (
    //             followingUser.rows.length === 0 ||
    //             followedUser.rows.length === 0
    //         ) {
    //             throw new Error("User does not exist");
    //         }

    //         // Check if the relationship already exists
    //         const existingRelationship = await db.query(
    //             `SELECT COUNT(*) FROM follows
    //         WHERE follower_id = $1 AND followed_user_id = $2`,
    //             [followingUser.rows[0].id, followedUser.rows[0].id]
    //         );

    //         const relationshipExists =
    //             parseInt(existingRelationship.rows[0].count) > 0;

    //         if (relationshipExists) {
    //             throw new Error(`Already following user: ${followed_user}`);
    //         } else {
    //             // Insert the follow relationship
    //             await db.query(
    //                 `INSERT INTO follows (follower_id, followed_user_id)
    //             VALUES ($1, $2)`,
    //                 [followingUser.rows[0].id, followedUser.rows[0].id]
    //             );
    //         }

    //         // Retrieve users following the followed_user
    //         let result = await db.query(
    //             `SELECT u.username
    //         FROM users u
    //         JOIN follows f ON f.follower_id = u.id
    //         WHERE f.followed_user_id = $1`,
    //             [followedUser.rows[0].id]
    //         );
    //         return result.rows;
    //     } catch (err) {
    //         // Handle errors
    //         throw new Error(`Failed to follow user: ${err.message}`);
    //     }
    // }

    // static async unfollow(following_user, followed_user) {
    //     // Check if the users exist and get their IDs
    //     const followingUser = await db.query(
    //         `SELECT id FROM users WHERE username = $1`,
    //         [following_user]
    //     );

    //     const followedUser = await db.query(
    //         `SELECT id FROM users WHERE username = $1`,
    //         [followed_user]
    //     );

    //     await db.query(
    //         `DELETE FROM follows
    //         WHERE follower_id = $1
    //         AND followed_user_id = $2`,
    //         [followingUser.rows[0].id, followedUser.rows[0].id]
    //     );

    //     return "Unfollowed user:", followed_user;
    // }
}

module.exports = User;
