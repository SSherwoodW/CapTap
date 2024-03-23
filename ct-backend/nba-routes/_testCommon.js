"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Game = require("../models/game");

async function commonBeforeAll() {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM teams");
    await db.query("DELETE FROM players");
    await db.query("DELETE FROM journals");
    await db.query("DELETE FROM journal_players");
    await db.query("DELETE FROM games");
    await db.query("DELETE FROM boxscores");

    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE teams_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE players_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE journals_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE games_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE boxscores_id_seq RESTART WITH 1");

    await db.query(`
        INSERT INTO teams (api_id, name, code)
        VALUES ('team1', 'Team 1', 'T1'),
               ('team2', 'Team 2', 'T2'),
               ('team3', 'Team 3', 'T3'),
               ('teamNoGames', 'Team NoGames', 'T99')`);

    await db.query(`
        INSERT INTO players (api_id, first_name, last_name, full_name, season_id, team_id)
        VALUES ('player1', 'Player', 'One', 'Player One', 'season1', 'team1'),
               ('player2', 'Player', 'Two', 'Player Two', 'season1', 'team2'),
               ('player3', 'Player', 'NoGames', 'Player NoGames', 'season1', 'teamNoGames'),
               ('player4', 'Player', 'Four', 'Player Four', 'season1', 'team1')`);

    // Create test users
    await User.register({
        username: "user1",
        password: "password1",
        firstName: "User",
        lastName: "One",
        email: "user1@test.com",
        birthdate: "12-01-1992",
        isAdmin: false,
    });
    await User.register({
        username: "user2",
        password: "password2",
        firstName: "User",
        lastName: "Two",
        email: "user2@test.com",
        birthdate: "01-01-1992",
        isAdmin: false,
    });
    await User.register({
        username: "admin1",
        password: "password",
        firstName: "Admin",
        lastName: "One",
        email: "admin@test.com",
        birthdate: "01-01-1999",
        isAdmin: true,
    });
}

async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {
    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    await db.end();
}

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
};
