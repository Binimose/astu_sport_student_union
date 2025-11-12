// controllers/matchController.js
const pool = require('../config/db');

const getMatches = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, 
             t1.name AS team1_name, t2.name AS team2_name
      FROM matches m
      JOIN teams t1 ON m.team1_id = t1.id
      JOIN teams t2 ON m.team2_id = t2.id
      ORDER BY m.match_date
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateScore = async (req, res) => {
  const { id } = req.params;
  const { score_team1, score_team2, status } = req.body;

  try {
    const result = await pool.query(`
      UPDATE matches 
      SET score_team1 = $1, score_team2 = $2, status = $3
      WHERE id = $4 RETURNING *
    `, [score_team1, score_team2, status || 'live', id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMatches, updateScore };