const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all assets
router.get("/", (req, res) => {
  const sql = "SELECT * FROM asset";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
