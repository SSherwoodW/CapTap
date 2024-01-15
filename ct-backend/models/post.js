"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

/** Related functions for posts. */

class Post {
    /** Create post with data.
     *
     * Requires {username, description}
     *
     * Returns { id, username, description }
     *
     * Throws BadRequestError on post failure.
     **/

    static async postPost(username, description) {
        // find user
        const userRes = await db.query(
            `SELECT id
           FROM users
           WHERE username = $1`,
            [username]
        );

        const userId = userRes.rows[0].id;
        console.log("userId:", userId);

        const result = await db.query(
            `INSERT INTO posts (user_id,
                             description)
           VALUES ($1, $2)
           RETURNING id, user_id, description, created_at`,
            [userId, description]
        );

        let post = result.rows[0];

        if (!post) throw BadRequestError(`Unable to post.`);

        return post;
    }

    /** Get a specific post
     *
     * Requires postId
     *
     * Returns { post: {userId, description, createdAt }}
     */

    static async find(postId) {
        const result = await db.query(
            `
        SELECT user_id, 
               description, 
               created_at
        FROM posts
        WHERE id = $1`,
            [postId]
        );

        return result.rows[0];
    }

    /** Get all posts from all users
     *
     * No params
     *
     * Returns { posts: [ { post}, {post}, {post}...] }
     */

    static async findAll() {
        const result = await db.query(
            `SELECT id,
            user_id AS userId,
            description,
            created_at AS createdAt
            FROM posts
            ORDER BY user_id`
        );

        return result.rows;
    }

    /** Get all posts from a single user
     *
     * Requires {userId}
     *
     * Returns { posts: [ { post}, {post}, {post}...] }
     *
     * Throws NotFoundError if not found.
     */

    static async findUserPosts(userId) {
        const result = await db.query(
            `SELECT id,
            description,
            created_at AS createdAt
            FROM posts
            WHERE user_id = $1
            ORDER BY id`,
            [userId]
        );

        if (!result.rows)
            throw new NotFoundError("No posts found by that user.");

        return result.rows;
    }

    /** Update post [description]
     *
     * The only possible update for posts is 'description'.
     *
     * Requires { username, description }
     *
     * Returns { userId, description, createdAt }
     *
     * Throws BadRequestError if post is not updated.
     *
     */

    static async update(description, postId) {
        const result = await db.query(
            `UPDATE posts
        SET description = $1
        WHERE id = $2
        RETURNING user_id, description, created_at`,
            [description, postId]
        );

        if (!result.rows) throw new BadRequestError("Post not found:", postId);

        return result.rows;
    }
}

module.exports = Post;
