// db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// TEST CONNECTION
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Connection failed:', err.stack);
  }
  console.log('Connected to PostgreSQL');
  client.query('SELECT NOW()', (err, res) => {
    release();
    if (err) {
      return console.error('Query failed:', err.stack);
    }
    console.log('DB Time:', res.rows[0].now);
  });
});

module.exports = pool;