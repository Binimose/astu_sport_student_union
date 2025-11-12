// create-admin.js
const bcrypt = require('bcrypt');

bcrypt.hash('NewAdmin@2025', 12).then(hash => {
  console.log('NEW ADMIN HASH:');
  console.log(hash);
  console.log('\n\nPASTE THIS IN PGADMIN:');
  console.log(`INSERT INTO users (student_id, full_name, email, password_hash, role, status) 
VALUES ('ADMIN002', 'New Admin', 'newadmin@astu.edu.et', '${hash}', 'admin', 'approved');`);
});