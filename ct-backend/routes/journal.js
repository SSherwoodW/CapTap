"use strict";

/** Routes for journal. */

const jsonschema = require("jsonschema");

const express = require("express");
const {
    ensureCorrectUserOrAdmin,
    ensureAdmin,
    ensureLoggedIn,
} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Journal = require("../models/journal");
const User = require("../models/user");
const journalNewSchema = require("../schemas/journalNew.json");
const journalPlayerNewSchema = require("../schemas/journalPlayersNew.json");
const journalUpdateSchema = require("../schemas/journalUpdate.json");

const router = express.Router();

/** POST / {
 *      description: "test description",
 *      range: "L5",
 *      data: {
 *      playerIds: [1,2],
 *      overUnders: [ [1, "Over"], [2, "Under"] ],
 *      statCats: [ [1, "Points"], [2, "Rebounds"] ],
 *      values: [ [1, 25], [2, 10] ]},
 *      userId: 999
 *      }  =>
 *      { id, user_id, description, timestamp }
 *
 * Adds a new journal entry. This is for the correct user to create a new journal entry on their Journal page.
 *
 *
 * This returns the new entry { newEntry: { id, user_id, description, created_at} }
 *
 * Authorization required: correct user or admin.
 **/

router.post(
    "/:username",
    ensureCorrectUserOrAdmin,
    async function (req, res, next) {
        try {
            const { description, range, data } = req.body;
            console.log(req.body);

            const journalPlayersData = data.playerIds.map((playerId, index) => {
                return {
                    playerId,
                    statCategory: data.statCats[index][1],
                    overUnder: data.overUnders[index][1],
                    value: Number(data.values[index][1]),
                };
            });

            const journalValidator = jsonschema.validate(
                { userId: Number(req.body.userId), description, range },
                journalNewSchema
            );
            if (!journalValidator.valid) {
                const journalErrs = journalValidator.errors.map((e) => e.stack);
                throw new BadRequestError(journalErrs);
            }

            const journalPlayersValidator = journalPlayersData.map(
                (playerData) => {
                    return jsonschema.validate(
                        playerData,
                        journalPlayerNewSchema
                    );
                }
            );

            const invalidJournalPlayersData = journalPlayersValidator.filter(
                (validationResult) => !validationResult.valid
            );
            if (invalidJournalPlayersData.length > 0) {
                const journalPlayersErrs = invalidJournalPlayersData.map(
                    (result) => result.errors.map((e) => e.stack)
                );
                throw new BadRequestError(journalPlayersErrs);
            }

            const newEntryData = {
                description,
                range,
                journalPlayersData,
            };

            const newEntry = await Journal.post(req.body.userId, newEntryData);
            console.log("newEntry journalRoutes:", newEntry);

            return res.status(201).json({ newEntry });
        } catch (err) {
            return next(err);
        }
    }
);

/** GET / { }  => { entries: [ { id, userId} ] }
 *
 * Gets all journal entries from all users.
 *
 * This returns all posts { entries: [ { entry }, { entry },{ entry } ] }
 *
 * Authorization required: Admin.
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const entries = await Journal.findAll();
        return res.json({ entries });
    } catch (err) {
        return next(err);
    }
});

/** GET / { }  => { posts: [ { id, userId} ] }
 *
 * Gets all journal entries for specific user.
 *
 * This returns all entries - { entries: [ { entry }, { entry },{ entry } ] }
 *
 * Authorization required: correct user or admin.
 **/

router.get(
    "/:username",
    ensureCorrectUserOrAdmin,
    async function (req, res, next) {
        try {
            const entries = await Journal.findUserEntries(req.params.username);
            return res.json({ entries });
        } catch (err) {
            return next(err);
        }
    }
);

/** GET / { username, journalId }  => { entry: [ { id, userId} ] }
 *
 * Gets specific journal entry from specific user.
 *
 * This returns a single journal entry
 *
 * Authorization required: Correct user or admin.
 **/

router.get(
    "/:username/:journalId",
    ensureCorrectUserOrAdmin,
    async function (req, res, next) {
        try {
            const entry = await Journal.find(req.params.journalId);
            return res.json({ entry: entry });
        } catch (err) {
            return next(err);
        }
    }
);

/** UPDATE */

router.patch(
    "/:userId/:journalId",
    ensureCorrectUserOrAdmin,
    async function (req, res, next) {
        try {
            const validator = jsonschema.validate(
                req.body,
                journalUpdateSchema
            );
            if (!validator.valid) {
                const errs = validator.errors.map((e) => e.stack);
                throw new BadRequestError(errs);
            }
            const description = req.body.description;
            console.log(req.body.description);

            const entry = await Journal.update(
                req.params.journalId,
                description
            );

            console.log(entry);
            return res.json({ entry });
        } catch (err) {
            return next(err);
        }
    }
);

router.delete(
    "/:username/:journalId",
    ensureCorrectUserOrAdmin,
    async function (req, res, next) {
        try {
            const deletion = await Journal.delete(req.params.journalId);
            return res.json({ deletion });
        } catch (err) {
            return next(err);
        }
    }
);

module.exports = router;
