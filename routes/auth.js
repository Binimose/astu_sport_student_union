// routes/auth.js
const express = require('express');
const { register , login } = require('../controllers/authController');
const upload = require('../middleware/upload'); // ← MUST BE HERE

const router = express.Router();

// EXACT ORDER: upload.fields → register
router.post('/register', 
  upload.fields([
    { name: 'idFront', maxCount: 1 },
    { name: 'idBack', maxCount: 1 }
  ]), 
  register
);

// routes/auth.js (ADD THIS LINE)
router.post('/login', login);
module.exports = router;