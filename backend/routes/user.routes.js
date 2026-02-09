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

// Register new resident
router.post("/register", (req, res) => {
    const { name, phone_number, email, flat_id } = req.body;

    if (!name || !flat_id) {
        return res.status(400).json({ message: "Name and Flat ID are required" });
    }

    const sql = "INSERT INTO resident (name, phone_number, email, flat_id, status) VALUES (?, ?, ?, ?, 'ACTIVE')";
    db.query(sql, [name, phone_number, email, flat_id], (err, result) => {
        if (err) {
            // Check for duplicate phone number
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "Phone number already registered" });
            }
            return res.status(500).json(err);
        }
        res.json({
            message: "Resident registered successfully",
            resident_id: result.insertId,
            name: name,
            flat_id: flat_id
        });
    });
});

// Login (Resident)
router.post("/login", (req, res) => {
    const { name, resident_id } = req.body;

    if (!name || !resident_id) {
        return res.status(400).json({ message: "Name and Resident ID are required" });
    }

    const sql = "SELECT * FROM resident WHERE name = ? AND resident_id = ?";
    db.query(sql, [name, resident_id], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const resident = results[0];
        res.json({
            message: "Login successful",
            user: resident
        });
    });
});

// Login (Technician)
router.post("/login/technician", (req, res) => {
    const { name, technician_id } = req.body;

    if (!name || !technician_id) {
        return res.status(400).json({ message: "Name and Technician ID are required" });
    }

    const sql = "SELECT * FROM technician WHERE name = ? AND technician_id = ?";
    db.query(sql, [name, technician_id], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const technician = results[0];
        res.json({
            message: "Login successful",
            user: technician
        });
    });
});

module.exports = router;
