"use strict";

/** Express app for captap. */

const express = require("express");
const cors = require("cors");
const schedule = require("node-schedule");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const journalRoutes = require("./routes/journal");

const gamesRoutes = require("./nba-routes/games");
const teamsRoutes = require("./nba-routes/teams");
const playersRoutes = require("./nba-routes/players");

const { updateDailyBoxscores } = require("./helpers/boxscore-controller");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/journal", journalRoutes);
app.use("/games", gamesRoutes);
app.use("/teams", teamsRoutes);
app.use("/players", playersRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

/** Scheduled function to update boxscores table with new daily player data */
const dailyJob = schedule.scheduleJob("0 2 * * *", async () => {
    console.log("Running daily job...");
    await updateDailyBoxscores();
});

// (async () => {
//     try {
//         console.log("Running updateDailyBoxscores manually...");
//         await updateDailyBoxscores();
//         console.log("updateDailyBoxscores completed successfully.");
//     } catch (error) {
//         console.error("Error running updateDailyBoxscores:", error);
//     }
// })();

module.exports = app;
