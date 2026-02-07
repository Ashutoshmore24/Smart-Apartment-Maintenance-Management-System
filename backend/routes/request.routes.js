const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all maintenance requests
router.get("/", (req, res) => {
  const sql = `
    SELECT mr.request_id,
           r.name AS resident_name,
           mr.request_type,
           mr.status,
           mr.description,
           mr.request_date,
           t.name AS technician_name,
           mr.resident_id,
           mr.technician_id
    FROM maintenance_request mr
    JOIN resident r ON mr.resident_id = r.resident_id
    LEFT JOIN technician t ON mr.technician_id = t.technician_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// Create a new maintenance request
router.post("/", (req, res) => {
  const { resident_id, request_type, description } = req.body;
  const sql = `
    INSERT INTO maintenance_request (resident_id, request_type, description, status, request_date) 
    VALUES (?, ?, ?, 'Pending', CURDATE())
  `;
  db.query(sql, [resident_id, request_type, description], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Request created successfully", id: result.insertId });
  });
});

// Update request status and assign technician
router.put("/:id", (req, res) => {
  const { status, technician_id } = req.body;
  const { id } = req.params;

  let sql = "UPDATE maintenance_request SET status = ?";
  const params = [status];

  if (technician_id) {
    sql += ", technician_id = ?";
    params.push(technician_id);
  }

  sql += " WHERE request_id = ?";
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Request updated successfully" });
  });
});

module.exports = router;
