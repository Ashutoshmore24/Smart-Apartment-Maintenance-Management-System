const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Get all residents
router.get("/residents", (req, res) => {
    const sql = "SELECT * FROM resident";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Get all APPROVED technicians (for admin assigning)
router.get("/technicians", (req, res) => {
    const sql = "SELECT * FROM technician WHERE status = 'APPROVED'";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Admin Panel: Get ALL technicians (including PENDING)
router.get("/technicians/all", (req, res) => {
    const sql = `
        SELECT t.*, 
               COUNT(r.request_id) AS total_assigned,
               SUM(CASE WHEN r.status = 'COMPLETED' THEN 1 ELSE 0 END) AS total_completed
        FROM technician t
        LEFT JOIN maintenance_request r ON t.technician_id = r.technician_id
        GROUP BY t.technician_id
        ORDER BY t.technician_id DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Admin Panel: Update Technician Status (Approve/Reject)
router.put("/technicians/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    if (status === 'REJECTED') {
        const sql = "DELETE FROM technician WHERE technician_id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Technician application rejected and deleted" });
        });
    } else {
        const sql = "UPDATE technician SET status = ? WHERE technician_id = ?";
        db.query(sql, [status, id], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: `Technician status updated to ${status}` });
        });
    }
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

// Register new technician (PENDING state)
router.post("/register/technician", (req, res) => {
    const { name, phone_number, specialization } = req.body;

    if (!name || !specialization) {
        return res.status(400).json({ message: "Name and Specialization are required" });
    }

    const sql = "INSERT INTO technician (name, phone_number, specialization, status) VALUES (?, ?, ?, 'PENDING')";
    db.query(sql, [name, phone_number, specialization], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({
            message: "Technician registered successfully. Pending Admin Approval.",
            technician_id: result.insertId,
            name: name
        });
    });
});

// Login (Resident)
router.post("/login", (req, res) => {
    const { name, resident_id } = req.body;

    console.log("LOGIN INPUT:", name, resident_id);

    if (!name || !resident_id) {
        return res.status(400).json({ message: "Name and Resident ID are required" });
    }

    const sql = "SELECT * FROM resident WHERE name = ? AND resident_id = ?";

    db.query(sql, [name.trim(), parseInt(resident_id)], (err, results) => {
        if (err) {
            console.error("DB ERROR:", err);
            return res.status(500).json({ message: "Database error" });
        }

        console.log("RESULT:", results);

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const resident = results[0];

        const token = jwt.sign(
            { id: resident.resident_id, role: 'resident' },
            process.env.JWT_SECRET || "defaultsecret",
            { expiresIn: "1d" }
        );

        res.cookie("token", token, { 
            httpOnly: true, 
            secure: true, 
            path: "/", 
            sameSite: "none" 
        });

        res.json({
            message: "Login successful",
            user: resident,
            role: "resident"
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

        if (technician.status === 'PENDING') {
            return res.status(403).json({ message: "Your account is pending admin approval." });
        }

        const token = jwt.sign(
            { id: technician.technician_id, role: 'technician' },
            process.env.JWT_SECRET || "defaultsecret",
            { expiresIn: "1d" }
        );

        res.cookie("token", token, { 
            httpOnly: true, 
            secure: true, 
            path: "/", 
            sameSite: "none" 
        });

        res.json({
            message: "Login successful",
            user: technician,
            role: "technician"
        });
    });
});

module.exports = router;