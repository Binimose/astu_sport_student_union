-- sql/phase2-tables.sql

-- Tournaments
CREATE TABLE tournaments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sport VARCHAR(50) NOT NULL,
  start_date DATE,
  end_date DATE,
  format VARCHAR(20) DEFAULT 'league', -- league, knockout
  status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, ongoing, completed
  created_at TIMESTAMP DEFAULT NOW()
);

-- Teams
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo_url TEXT,
  captain_id INTEGER REFERENCES users(id),
  tournament_id INTEGER REFERENCES tournaments(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Players (can be in multiple teams)
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  jersey_number VARCHAR(10),
  position VARCHAR(30),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team Members (junction)
CREATE TABLE team_members (
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, player_id)
);

-- Indexes
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_teams_tournament ON teams(tournament_id);