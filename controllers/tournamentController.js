const pool = require('../config/db');
const queries = require('../sql/queries');

// controllers/tournamentController.js
const createTournament = async (req, res) => {
  const { name, sport, start_date, end_date } = req.body;
  try {
    const result = await pool.query(queries.CREATE_TOURNAMENT, [name, sport, start_date, end_date]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTournaments = async (req, res) => {
  try {
    const result = await pool.query(queries.GET_TOURNAMENTS);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTournament, getTournaments };
