// server.js
require('dotenv').config();
require('./config/db'); // DB Connected
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ASTU Sports Backend - Registration Ready' });
});
const adminRoutes = require('./routes/admin');

app.use('/api/admin', adminRoutes);
const tournamentRoutes = require('./routes/tournament');
app.use('/api/tournaments', tournamentRoutes);

const teamRoutes = require('./routes/team');
app.use('/api/teams', teamRoutes);



const matchRoutes = require('./routes/match');
app.use('/api/matches', matchRoutes);

const votingRoutes = require('./routes/voting');
app.use('/api/voting', votingRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});