-- Add this if not already there
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  department VARCHAR(50),
  role VARCHAR(20) DEFAULT 'student',
  status VARCHAR(20) DEFAULT 'pending',
  id_front_url TEXT,
  id_back_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);