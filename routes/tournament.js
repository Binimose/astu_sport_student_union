const express = require('express');
const { createTournament, getTournaments } = require('../controllers/tournamentController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();
router.use(protect, adminOnly);

router.post('/', protect, adminOnly, createTournament);
router.get('/', getTournaments);

module.exports = router;