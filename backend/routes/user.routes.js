const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all residents
router.get("/residents", (req, res) => {
    const sql = "SELECT * FROM resident";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Get all technicians
router.get("/technicians", (req, res) => {
    const sql = "SELECT * FROM technician";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;
