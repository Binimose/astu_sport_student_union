// controllers/teamController.js
const pool = require('../config/db');
const queries = require('../sql/queries');
const crypto = require('crypto');

const generateCode = () => crypto.randomBytes(4).toString('hex').toUpperCase();

const createTeam = async (req, res) => {
  const { name, sport, tournament_id } = req.body;
  const captain_id = req.user.id;
  const invite_code = generateCode();

  try {
    const teamResult = await pool.query(queries.CREATE_TEAM, [name, sport, captain_id, tournament_id, invite_code]);
    const team = teamResult.rows[0];

    await pool.query(queries.JOIN_TEAM, [team.id, captain_id]);

    res.status(201).json({ message: 'Team created', team: { ...team, invite_code } });
  } catch (err) {
    console.error('Team creation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const joinTeam = async (req, res) => {
  const { invite_code } = req.body;
  const user_id = req.user.id;

  try {
    // 1. Find team by invite code
    const teamResult = await pool.query(queries.GET_TEAM_BY_CODE, [invite_code]);
    const team = teamResult.rows[0];
    if (!team) return res.status(404).json({ message: 'Invalid invite code' });

    // 2. Check if already in team
    const checkResult = await pool.query(
      'SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2',
      [team.id, user_id]
    );
    if (checkResult.rows[0]) {
      return res.status(400).json({ message: 'You are already in this team' });
    }

    // 3. Add to team
    await pool.query(queries.ADD_PLAYER_TO_TEAM, [team.id, user_id]);

    res.json({ message: 'Joined team successfully!', team_id: team.id });
  } catch (err) {
    console.error('Join team error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const getMyTeam = async (req, res) => {
  try {
    const result = await pool.query(queries.GET_MY_TEAM, [req.user.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Not in any team' });

    const team = result.rows[0];
    const players = await pool.query(queries.GET_TEAM_PLAYERS, [team.id]);

    res.json({ team, players: players.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// EXPORT ALL
module.exports = { createTeam, joinTeam, getMyTeam };