"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const {
    ensureCorrectUserOrAdmin,
    ensureAdmin,
    ensureLoggedIn,
} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Post = require("../models/post");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/*********** CRUD USER ROUTES **************************************/
// *****************************************************************/

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema);
        console.log(validator.valid);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const user = await User.register(req.body);
        const token = createToken(user);
        return res.status(201).json({ user, token });
    } catch (err) {
        return next(err);
    }
});

/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const users = await User.findAll();
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email, birthdate, isAdmin }
 *
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get(
    "/:username",
    ensureCorrectUserOrAdmin,
    async function (req, res, next) {
        try {
            const user = await User.get(req.params.username);
            return res.json({ user });
        } catch (err) {
            return next(err);
        }
    }
);

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, birthdate, email }
 *
 * Returns { username, firstName, lastName, email, birthdate, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch(
    "/:username",
    ensureCorrectUserOrAdmin,
    async function (req, res, next) {
        try {
            const validator = jsonschema.validate(req.body, userUpdateSchema);
            if (!validator.valid) {
                const errs = validator.errors.map((e) => e.stack);
                throw new BadRequestError(errs);
            }

            const user = await User.update(req.params.username, req.body);
            return res.json({ user });
        } catch (err) {
            return next(err);
        }
    }
);

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete(
    "/:username",
    ensureCorrectUserOrAdmin,
    async function (req, res, next) {
        try {
            await User.remove(req.params.username);
            return res.json({ deleted: req.params.username });
        } catch (err) {
            return next(err);
        }
    }
);

/*********** USER POST ROUTES **************************************/
// *****************************************************************/

/** GET /[username]/posts {user} => { posts }
 *
 * Requires username.
 *
 * Returns all posts from this user.. { posts: [ {post}, {post}, ... ] }
 *
 * Authorization required: logged in user.
 **/

router.get("/:username/posts", ensureLoggedIn, async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        const userId = user.id;

        const posts = await Post.findUserPosts(userId);
        return res.json({ posts });
    } catch (err) {
        return next(err);
    }
});

/** GET /[username]/posts/[postId] {user} => { posts }
 *
 * Requires post id.
 *
 * Returns requested post {post: {user_id, description, created_at}}
 *
 * Authorization required: logged in user.
 **/

router.get(
    "/:username/posts/:postId",
    ensureLoggedIn,
    async function (req, res, next) {
        try {
            const post = await Post.find(req.params.postId);
            return res.json({ post });
        } catch (err) {
            return next(err);
        }
    }
);

/*********** USER FOLLOW ROUTES **************************************/
// *****************************************************************/

/** GET /[username]/followers {userId} => {followers: [ follower, follower, ... ]}
 *
 * Requires username, retrieved from url params.
 *
 * Returns all followers -- {followers: [] }
 *
 * Authorization required: logged in user.
 *
 */

router.get(
    "/:username/followers",
    ensureLoggedIn,
    async function (req, res, next) {
        try {
            const user = await User.get(req.params.username);
            const userId = user.id;

            const followers = await User.followers(userId);
            return res.json({ followers });
        } catch (err) {
            return next(err);
        }
    }
);

/** GET /[username]/following {userId} => {following: [ user, user, ... ]}
 *
 * Requires username, retrieved from url params.
 *
 * Returns all users USER is following -- {following: [] }
 *
 * Authorization required: logged in user.
 *
 */
router.get(
    "/:username/following",
    ensureLoggedIn,
    async function (req, res, next) {
        try {
            const user = await User.get(req.params.username);
            const userId = user.id;

            const following = await User.following(userId);
            return res.json({ following });
        } catch (err) {
            return next(err);
        }
    }
);

/** POST /[username]/follow {username, following_username} => {message: "Followed successfully"}
 *
 * Requires user-being-followed-username from params and user-following-id from body.
 *
 * Returns message: "Followed successfully."
 *
 * Authorization required: logged in user.
 *
 */

router.post(
    "/:username/follow",
    ensureLoggedIn,
    async function (req, res, next) {
        try {
            const following_user = req.body.username;
            const followed_user = req.params.username;

            const follow = await User.follow(following_user, followed_user);
            return res.json({ follow });
        } catch (err) {
            return next(err);
        }
    }
);

/** POST /[username]/unfollow {username, following_username} => {message: "Unfollowed user: username"}
 *
 * Requires user-being-followed-username from params and user-following-id from body.
 *
 * Returns message: "Unfollowed user: username."
 *
 * Authorization required: logged in user.
 *
 */

router.delete(
    "/:username/unfollow",
    ensureLoggedIn,
    async function (req, res, next) {
        try {
            const following_user = req.body.username;
            const followed_user = req.params.username;

            const unfollow = await User.unfollow(following_user, followed_user);
            return res.json({ unfollow });
        } catch (err) {
            return next(err);
        }
    }
);

module.exports = router;
