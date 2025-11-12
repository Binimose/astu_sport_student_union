// routes/team.js
const express = require('express');
const router = express.Router();

// IMPORT CONTROLLERS
const { createTeam, joinTeam, getMyTeam } = require('../controllers/teamController');

// IMPORT MIDDLEWARE
const { protect } = require('../middleware/auth');

// ROUTES
router.post('/', protect, createTeam);
router.post('/join', protect, joinTeam);
router.get('/my', protect, getMyTeam);

module.exports = router;