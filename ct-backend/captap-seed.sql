-- all test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email, birthdate, is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'joel@joelburton.com',
        '2023-11-30',
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'joel@joelburton.com',
        '2023-12-01',
        TRUE),
        ('testuser3',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User3',
        'joel@joelburton.com',
        '2023-12-01',
        FALSE);

INSERT INTO teams (api_id, name, code)
VALUES 
    ('team1_api_id', 'Team 1', 'T1'),
    ('team2_api_id', 'Team 2', 'T2'),
    ('team3_api_id', 'Team 3', 'T3');

-- Seed data for the players table
INSERT INTO players (api_id, first_name, last_name, full_name, season_id, team_id)
VALUES 
    ('player1_api_id', 'John', 'Doe', 'John Doe', 'season1_id', 'team1_api_id'),
    ('player2_api_id', 'Jane', 'Smith', 'Jane Smith', 'season1_id', 'team2_api_id'),
    ('player3_api_id', 'Alice', 'Johnson', 'Alice Johnson', 'season1_id', 'team3_api_id');

-- Seed data for the journals table
INSERT INTO journals (user_id, description, range)
VALUES 
    (1, 'Journal 1', 'Range 1'),
    (2, 'Journal 2', 'Range 2'),
    (3, 'Journal 3', 'Range 3');

-- Seed data for the journal_players table
INSERT INTO journal_players (journal_id, player_id, stat_category, over_under, value)
VALUES 
    (7, 1, 'Category 1', 'Over', 10),
    (8, 2, 'Category 2', 'Under', 5),
    (9, 3, 'Category 3', 'Over', 8);

-- Seed data for the games table
INSERT INTO games (api_id, team_1_id, team_2_id, game_date)
VALUES 
    ('game1_api_id', 'team1_api_id', 'team2_api_id', '2024-01-01'),
    ('game2_api_id', 'team2_api_id', 'team3_api_id', '2024-01-02'),
    ('game3_api_id', 'team1_api_id', 'team3_api_id', '2024-01-03');

-- Seed data for the boxscores table
INSERT INTO boxscores (player_id, game_id, minutes, points, rebounds, assists, steals, blocks, turnovers, three_points_made, three_points_attempted)
VALUES 
    ('player1_api_id', 'game1_api_id', '30', 20, 10, 5, 2, 1, 3, 2, 5),
    ('player2_api_id', 'game1_api_id', '25', 15, 5, 8, 3, 0, 2, 1, 3),
    ('player3_api_id', 'game2_api_id', '35', 25, 12, 7, 4, 1, 4, 3, 6);