// routes/admin.js
const express = require('express');
const router = express.Router();

// IMPORT MIDDLEWARE
const { protect, adminOnly } = require('../middleware/auth');

// IMPORT CONTROLLERS
const { 
  getPending, 
  verifyUser, 
  getAllTeams, 
  scheduleMatch 
} = require('../controllers/adminController');

// ROUTES
router.get('/pending', protect, adminOnly, getPending);
router.patch('/verify/:id', protect, adminOnly, verifyUser);
router.get('/teams', protect, adminOnly, getAllTeams);
router.post('/matches', protect, adminOnly, scheduleMatch); // FIXED

module.exports = router;