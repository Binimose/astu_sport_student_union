// routes/match.js
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getMatches, updateScore } = require('../controllers/matchController');

router.get('/', getMatches);                    // Anyone can view
router.patch('/:id/score', protect, adminOnly, updateScore); // Admin only

module.exports = router;