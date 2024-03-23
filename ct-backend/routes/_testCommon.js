"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Journal = require("../models/journal");

async function commonBeforeAll() {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM journals");
    await db.query("DELETE FROM journal_players");
    await db.query("DELETE FROM players");

    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE journals_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE players_id_seq RESTART WITH 1");

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

    // let userToken = await createToken({ username: "user1", isAdmin: false });
    // u1Token = userToken;

    // let user2Token = await createToken({ username: "user2", isAdmin: false });
    // u2Token = user2Token;

    // let adminToken = await createToken({ username: "admin1", isAdmin: true });
    // admin1Token = adminToken;
    // console.log(admin1Token);

    const journalTestData = {
        playerIds: [1, 2],
        overUnders: [
            [1, "Over"],
            [2, "Under"],
        ],
        range: "L5",
        statCats: [
            [1, "Points"],
            [2, "Rebounds"],
        ],
        values: [
            [1, 25],
            [2, 10],
        ],
    };

    const journalPlayersData = journalTestData.playerIds.map(
        (playerId, index) => {
            return {
                playerId,
                statCategory: journalTestData.statCats[index][1],
                overUnder: journalTestData.overUnders[index][1],
                value: journalTestData.values[index][1],
            };
        }
    );

    // Journal entries
    await Journal.post(1, {
        description: "Test journal entry 1",
        range: "L5",
        journalPlayersData,
    });
    await Journal.post(2, {
        description: "Test journal entry 2",
        range: "L5",
        journalPlayersData,
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
