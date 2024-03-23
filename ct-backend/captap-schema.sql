CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password varchar NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  birthdate date NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  api_id varchar(50) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  code varchar(3)
);

CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  api_id varchar(50) UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  season_id varchar(50) NOT NULL,
  team_id varchar(50) NOT NULL
    REFERENCES teams(api_id) ON DELETE CASCADE
);

CREATE TABLE journals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  range varcher(10) NOT NULL,
  created_at timestamp WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journal_players (
    journal_id INTEGER REFERENCES journals(id) NOT NULL,
    player_id INTEGER REFERENCES players(id) NOT NULL,
    stat_category text NOT NULL,
    over_under varchar(10) NOT NULL,
    value SMALLINT NOT NULL,
    PRIMARY KEY(journal_id, player_id)
);

CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  api_id varchar(50) UNIQUE NOT NULL,
  team_1_id varchar(50) NOT NULL
    REFERENCES teams(api_id) ON DELETE CASCADE,
  team_2_id varchar(50) NOT NULL
    REFERENCES teams(api_id) ON DELETE CASCADE,
  game_date timestamp with time zone NOT NULL
);

CREATE TABLE boxscores (
  id SERIAL PRIMARY KEY,
  player_id varchar(50) NOT NULL
    REFERENCES players(api_id) ON DELETE CASCADE,
  game_id varchar(50) NOT NULL
    REFERENCES games(api_id) ON DELETE CASCADE,
  minutes varchar(50) NOT NULL,
  points integer NOT NULL,
  rebounds integer NOT NULL,
  assists integer NOT NULL,
  steals integer NOT NULL,
  blocks integer NOT NULL,
  turnovers integer NOT NULL,
  three_points_made integer NOT NULL,
  three_points_attempted integer NOT NULL
);



-- ALTER TABLE posts ADD FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- ALTER TABLE player_stats ADD FOREIGN KEY (player_id) REFERENCES players (id) ON DELETE CASCADE;

-- ALTER TABLE posts ADD FOREIGN KEY (game_id) REFERENCES games (id);

-- ALTER TABLE player_stats ADD FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE;

-- ALTER TABLE games ADD FOREIGN KEY (team_1_id) REFERENCES teams (id);

-- ALTER TABLE games ADD FOREIGN KEY (team_2_id) REFERENCES teams (id);


-- CREATE TABLE posts (
--   id SERIAL PRIMARY KEY,
--   user_id integer NOT NULL
--     REFERENCES users(id) ON DELETE CASCADE,
--   description varchar(255) NOT NULL,
--   created_at timestamp WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE player_stats (
--   id SERIAL PRIMARY KEY,
--   post_id integer NOT NULL
--     REFERENCES posts(id) ON DELETE CASCADE,
--   player_id integer NOT NULL
--     REFERENCES players ON DELETE CASCADE,
--   statistic_type varchar(50) NOT NULL,
--   values integer[] NOT NULL,
--   values_length INTEGER NOT NULL,
--   first_game_date DATE NOT NULL,
--   UNIQUE (player_id, first_game_date)
--   -- count of values here
--   -- IF values is 5, check date of the first game. IF that exists, this is a duplicate--use this row. 
-- );