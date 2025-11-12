// middleware/auth.js
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const queries = require('../sql/queries');

const protect = async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(queries.FIND_BY_ID, [decoded.id]);
    if (!result.rows[0]) return res.status(401).json({ message: 'User not found' });
    req.user = result.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
  next();
};

module.exports = { protect, adminOnly };