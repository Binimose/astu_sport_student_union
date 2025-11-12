// sql/queries.js
module.exports = {
  INSERT_USER: `
  INSERT INTO users (
    student_id, full_name, email, password_hash, department,
    id_front_url, id_back_url, profile_photo
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING id, email, status
`,
  GET_PENDING: `
  SELECT id, student_id, full_name, email, department, id_front_url, id_back_url
  FROM users WHERE status = 'pending'
`,
UPDATE_STATUS: `
  UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2
  RETURNING id, email, status
`,
CREATE_TOURNAMENT: `
  INSERT INTO tournaments (name, sport, start_date, end_date, status)
  VALUES ($1, $2, $3, $4, 'upcoming')
  RETURNING *
`,

CREATE_TEAM: `
  INSERT INTO teams (name, sport, captain_id, tournament_id)
  VALUES ($1, $2, $3, $4) RETURNING *
`,
ADD_PLAYER_TO_TEAM: `
  INSERT INTO team_members (team_id, user_id, role)
  VALUES ($1, $2, 'player') RETURNING *
`,
GET_TEAM_BY_CAPTAIN: `
  SELECT t.*, tm.role FROM teams t
  JOIN team_members tm ON t.id = tm.team_id
  WHERE tm.user_id = $1 AND tm.role = 'captain'
`,
GET_TEAM_PLAYERS: `
  SELECT u.id, u.full_name, u.student_id, tm.role, tm.joined_at
  FROM team_members tm
  JOIN users u ON tm.user_id = u.id
  WHERE tm.team_id = $1
`,

UPDATE_STATUS: `
  UPDATE users SET status = $1 WHERE id = $2
  RETURNING id, email, status`,

CREATE_TEAM: `
  INSERT INTO teams (name, sport, captain_id, tournament_id, invite_code)
  VALUES ($1, $2, $3, $4, $5) RETURNING *
`,
JOIN_TEAM: `
  INSERT INTO team_members (team_id, user_id, role)
  VALUES ($1, $2, 'player') ON CONFLICT DO NOTHING RETURNING *
`,
GET_TEAM_BY_CODE: `SELECT * FROM teams WHERE invite_code = $1`,
GET_MY_TEAM: `
  SELECT t.*, tm.role FROM teams t
  JOIN team_members tm ON t.id = tm.team_id
  WHERE tm.user_id = $1
`,

GET_TEAM_PLAYERS: `
  SELECT u.id, u.full_name, u.student_id, u.email, tm.role
  FROM team_members tm
  JOIN users u ON tm.user_id = u.id
  WHERE tm.team_id = $1
`,

GET_TOURNAMENTS: `SELECT * FROM tournaments ORDER BY created_at DESC`,
// sql/queries.js
FIND_BY_ID: `SELECT * FROM users WHERE id = $1`,
  FIND_BY_EMAIL: `SELECT * FROM users WHERE email = $1`,

CREATE_CATEGORY: `
  INSERT INTO voting_categories (name, description, voting_start, voting_end)
  VALUES ($1, $2, $3, $4) RETURNING *
`,

GET_ACTIVE_CATEGORIES: `SELECT * FROM voting_categories WHERE is_active = true`,
NOMINATE_PLAYER: `
  INSERT INTO nominees (category_id, player_id, team_id, description)
  VALUES ($1, $2, $3, $4) RETURNING *
`,
CAST_VOTE: `
  INSERT INTO votes (category_id, nominee_id, voter_id)
  VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *
`,
GET_VOTES_FOR_CATEGORY: `
  SELECT n.*, COUNT(v.id) AS votes_count
  FROM nominees n
  LEFT JOIN votes v ON n.id = v.nominee_id
  WHERE n.category_id = $1
  GROUP BY n.id
  ORDER BY votes_count DESC
`,
GET_VOTES_FOR_CATEGORY: `
  SELECT 
    n.id,
    n.description,
    u.full_name,
    u.profile_photo,
    t.name AS team_name,
    COALESCE(COUNT(v.id), 0) AS votes_count
  FROM nominees n
  JOIN users u ON n.player_id = u.id
  JOIN teams t ON n.team_id = t.id
  LEFT JOIN votes v ON n.id = v.nominee_id
  WHERE n.category_id = $1
  GROUP BY n.id, u.full_name, u.profile_photo, t.name
  ORDER BY votes_count DESC
`,
CLOSE_VOTING: `
  UPDATE voting_categories SET is_active = false WHERE id = $1
`,
};