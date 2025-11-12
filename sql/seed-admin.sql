INSERT INTO users (
  student_id, full_name, email, password_hash, role, status
) VALUES (
  'ADMIN001', 'System Admin', 'admin@astu.edu.et',
  '$2b$12$z8x9v7c6b5n4m3k2j1h0g9f8e7d6c5b4a3.', -- Hash of "Admin@123"
  'admin', 'approved'
)
ON CONFLICT (email) DO NOTHING;