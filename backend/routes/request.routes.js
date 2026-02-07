const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all maintenance requests
router.get("/", (req, res) => {
  const sql = `
    SELECT mr.request_id,
           r.name AS resident_name,
           mr.request_type,
           mr.status
    FROM maintenance_request mr
    JOIN resident r ON mr.resident_id = r.resident_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

module.exports = router;
