/* Everything Ready */
const db = require('../db');

const addPrioritySql = `
  ALTER TABLE maintenance_request 
  ADD COLUMN priority ENUM('NORMAL', 'HIGH', 'EMERGENCY') DEFAULT 'NORMAL' NOT NULL;
`;

db.query(addPrioritySql, (err, result) => {
  if (err) {
    // If it already exists (e.g. from previous run), MySQL throws ER_DUP_FIELDNAME
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("Column 'priority' already exists.");
    } else {
      console.error("Error adding column:", err);
    }
  } else {
    console.log("Added 'priority' column successfully.");
  }
  process.exit();
});