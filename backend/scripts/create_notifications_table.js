/* Everything Ready */
const db = require('../db');

const createTableSql = `
  CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('RESIDENT', 'TECHNICIAN', 'ADMIN') NOT NULL,
    user_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.query(createTableSql, (err, result) => {
  if (err) {
    console.error("Error creating notifications table:", err);
  } else {
    console.log("Notifications table created or already exists.");
  }
  process.exit();
});
