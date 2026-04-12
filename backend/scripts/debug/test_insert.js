/* Everything Ready */
require("dotenv").config();
const db = require("./db");

const sql = `
  INSERT INTO maintenance_request
  (resident_id, request_type, description, priority, status, request_date, request_category, asset_id)
VALUES(?, ?, ?, ?, 'PENDING', CURDATE(), ?, ?)
  `;

db.query(
  sql,
  [1, "Plumbing", "Test description", "NORMAL", "FLAT", null],
  (err, result) => {
    if (err) {
      console.error("SQL_ERROR_DETAILS:", err);
    } else {
      console.log("SUCCESS:", result);
    }
    process.exit();
  }
);
