// controllers/adminController.js
const pool = require('../config/db');
const queries = require('../sql/queries');

const getPending = async (req, res) => {
  try {
    const result = await pool.query(queries.GET_PENDING);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const status = action === 'approve' ? 'approved' : 'rejected';

    const result = await pool.query(queries.UPDATE_STATUS, [status, id]);
    const user = result.rows[0];

    res.json({ message: `User ${status}`, user });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.id, t.name, t.sport, t.invite_code, 
             u.full_name AS captain_name,
             COUNT(tm.user_id) - 1 AS player_count
      FROM teams t
      JOIN users u ON t.captain_id = u.id
      LEFT JOIN team_members tm ON t.id = tm.team_id
      GROUP BY t.id, u.full_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Get teams error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD THIS FUNCTION
const scheduleMatch = async (req, res) => {
  const { team1_id, team2_id, match_date, tournament_id = 1 } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO matches (tournament_id, team1_id, team2_id, match_date)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [tournament_id, team1_id, team2_id, match_date]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Schedule match error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// EXPORT ALL
module.exports = { 
  getPending, 
  verifyUser, 
  getAllTeams, 
  scheduleMatch   // ← ADDED
};