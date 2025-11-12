// server.js
require('dotenv').config();
require('./config/db'); // DB Connected

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Initialize Express
const app = express();

// === MIDDLEWARE ===
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// === ROUTES ===
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const tournamentRoutes = require('./routes/tournament');
const teamRoutes = require('./routes/team');
const matchRoutes = require('./routes/match');
const votingRoutes = require('./routes/voting');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/voting', votingRoutes);

// === HEALTH CHECK ===
app.get('/', (req, res) => {
  res.json({ 
    message: 'ASTU Sports Backend LIVE', 
    version: '1.0.0',
    deployed: 'Vercel',
    status: 'OK'
  });
});

// === EXPORT FOR VERCEL (CRITICAL) ===
module.exports = app;