"use strict";

/** Routes for posts. */

const jsonschema = require("jsonschema");

const express = require("express");
const {
    ensureCorrectUserOrAdmin,
    ensureAdmin,
    ensureLoggedIn,
} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Post = require("../models/post");
const User = require("../models/user");
const postNewSchema = require("../schemas/postNew.json");
const postUpdateSchema = require("../schemas/postUpdate.json");

const router = express.Router();

/** POST / { post }  => { id, user_id, description, timestamp }
 *
 * Adds a new post. This is for the correct user to create a new post on their feed.
 *
 *
 * This returns the new post { newPost: { id, user_id, description, created_at} }
 *
 * Authorization required: correct user or admin.
 **/

router.post(
    "/:username/post",
    ensureCorrectUserOrAdmin,
    async function (req, res, next) {
        try {
            const validator = jsonschema.validate(req.body, postNewSchema);
            if (!validator.valid) {
                const errs = validator.errors.map((e) => e.stack);
                throw new BadRequestError(errs);
            }

            const newPost = await Post.postPost(
                req.params.username,
                req.body.description
            );
            console.log(newPost);

            return res.status(201).json({ newPost });
        } catch (err) {
            return next(err);
        }
    }
);

/** GET / { }  => { posts: [ { id, userId} ] }
 *
 * Gets all posts from all users.
 *
 *
 * This returns all posts { posts: [ { post }, { post },{ post } ] }
 *
 * Authorization required: none.
 **/

router.get("/", async function (req, res, next) {
    try {
        const posts = await Post.findAll();
        return res.json({ posts });
    } catch (err) {
        return next(err);
    }
});

/** UPDATE */

router.patch(
    "/:username/posts/:postId",
    ensureCorrectUserOrAdmin,
    async function (req, res, next) {
        try {
            const description = req.body.description;
            console.log(req.params.postId);

            const post = await Post.update(description, req.params.postId);

            console.log(post);
            return res.json({ post });
        } catch (err) {
            return next(err);
        }
    }
);

module.exports = router;
