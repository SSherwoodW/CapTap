const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");

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

    await db.query(
        `INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email,
                          birthdate, 
                          is_admin)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com', '2000-01-01', False),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com', '2001-02-02', False)
        RETURNING username`,
        [
            await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
        ]
    );

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

    await db.query(`
        INSERT INTO journals (user_id, description, range)
        VALUES (1, 'Test journal', 'daily')`);

    await db.query(`
        INSERT INTO journal_players (journal_id, player_id, stat_category, over_under, value)
        VALUES (1, 1, 'points', 'Over', 20),
               (1, 2, 'rebounds', 'Under', 10)`);

    await db.query(`
        INSERT INTO games (api_id, team_1_id, team_2_id, game_date)
        VALUES ('game1', 'team1', 'team2', '2022-10-24 16:30:00-07'),
               ('game2', 'team2', 'team3', '2023-10-24 16:30:00-07'),
               ('game3', 'team1', 'team3', '2021-10-24 16:30:00-07'),
               ('game4', 'team1', 'team2', '2020-10-24 16:30:00-07'),
               ('game5', 'team3', 'team1', '2022-11-24 16:30:00-07')`);

    await db.query(`
        INSERT INTO boxscores (player_id, game_id, minutes, points, rebounds, assists, steals, blocks, turnovers, three_points_made, three_points_attempted)
        VALUES ('player1', 'game1', '30', 25, 10, 5, 2, 1, 3, 3, 5)`);
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
