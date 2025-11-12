const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/auth');
const { createCategory, nominatePlayer, castVote, getResults, closeVoting } = require('../controllers/votingController');

// Admin: Create category & nominate
router.post('/categories', protect, adminOnly, createCategory);
router.post('/nominate', protect, adminOnly, nominatePlayer);
router.patch('/close/:category_id', protect, adminOnly, closeVoting);

// Students: Cast vote
router.post('/vote', protect, castVote);

// Anyone: View results
router.get('/results/:category_id', getResults);

module.exports = router;