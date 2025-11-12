const pool = require('../config/db');
const queries = require('../sql/queries');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/auth');

const createCategory = async (req, res) => {
  const { name, description, voting_start, voting_end } = req.body;
  try {
    const result = await pool.query(queries.CREATE_CATEGORY, [name, description, voting_start, voting_end]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const nominatePlayer = async (req, res) => {
  const { category_id, player_id, team_id, description } = req.body;
  try {
    const result = await pool.query(queries.NOMINATE_PLAYER, [category_id, player_id, team_id, description]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const castVote = async (req, res) => {
  const { category_id, nominee_id } = req.body;
  const voter_id = req.user.id;

  try {
    // Check if already voted
    const existingVote = await pool.query(queries.GET_VOTER_VOTES, [voter_id]);
    if (existingVote.rows.some(v => v.category_id === category_id)) {
      return res.status(400).json({ message: 'Already voted in this category' });
    }

    const result = await pool.query(queries.CAST_VOTE, [category_id, nominee_id, voter_id]);
    if (!result.rows[0]) return res.status(400).json({ message: 'Vote already cast or invalid' });

    // Update nominee vote count
    await pool.query(`
      UPDATE nominees SET votes_count = votes_count + 1 WHERE id = $1
    `, [nominee_id]);

    res.json({ message: 'Vote cast successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getResults = async (req, res) => {
    const { category_id } = req.params;
    try {
      const result = await pool.query(queries.GET_VOTES_FOR_CATEGORY, [category_id]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };

const closeVoting = async (req, res) => {
  const { category_id } = req.params;
  try {
    await pool.query(queries.CLOSE_VOTING, [category_id]);
    res.json({ message: 'Voting closed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  createCategory, nominatePlayer, castVote, getResults, closeVoting 
};