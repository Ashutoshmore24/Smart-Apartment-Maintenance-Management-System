const express = require("express");
const db = require("../db");

const router = express.Router();

// ============================
// Get all maintenance requests
// ============================
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      mr.request_id,
      r.name AS resident_name,
      mr.request_type,
      mr.status,
      mr.description,
      mr.request_date,
      mr.request_category,
      f.flat_number,
      a.asset_name,
      t.name AS technician_name,
      mr.resident_id,
      mr.technician_id
    FROM maintenance_request mr
    JOIN resident r ON mr.resident_id = r.resident_id
    LEFT JOIN flat f ON r.flat_id = f.flat_id
    LEFT JOIN asset a ON mr.asset_id = a.asset_id
    LEFT JOIN technician t ON mr.technician_id = t.technician_id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ============================
// Create new maintenance request
// ============================
router.post("/", (req, res) => {
  const {
    resident_id,
    request_type,
    description,
    request_category = "FLAT",
    asset_id = null
  } = req.body;

  if (!description || description.trim() === "") {
    return res.status(400).json({ message: "Description cannot be empty" });
  }

  const sql = `
    INSERT INTO maintenance_request 
    (resident_id, request_type, description, status, request_date, request_category, asset_id) 
    VALUES (?, ?, ?, 'PENDING', CURDATE(), ?, ?)
  `;

  db.query(
    sql,
    [resident_id, request_type, description, request_category, asset_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({
        message: "Request created successfully",
        id: result.insertId
      });
    }
  );
});

// ============================
// Update request status / assign technician (FIXED)
// ============================
router.put("/:id", (req, res) => {
  const { status, technician_id } = req.body;
  const { id } = req.params;

  let sql = "UPDATE maintenance_request SET ";
  const params = [];

  if (status) {
    sql += "status = ?";
    params.push(status);
  }

  if (technician_id) {
    if (params.length > 0) sql += ", ";
    sql += "technician_id = ?";
    params.push(technician_id);
  }

  sql += " WHERE request_id = ?";
  params.push(id);

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Request updated successfully" });
  });
});


// ============================
// Technician completes request (COST + BILL)
// ============================
router.put("/complete/:request_id", (req, res) => {
  const { request_id } = req.params;
  const { cost } = req.body;

  if (!cost || cost <= 0) {
    return res.status(400).json({ message: "Cost is mandatory and must be greater than 0" });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    // 1. Update request status and cost
    const updateSql = `
      UPDATE maintenance_request
      SET status = 'COMPLETED', cost = ?, completed_at = NOW()
      WHERE request_id = ? AND status != 'COMPLETED'
    `;

    db.query(updateSql, [cost, request_id], (err, result) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ error: err.message }));
      }

      if (result.affectedRows === 0) {
        return db.rollback(() => res.status(400).json({ message: "Request not found or already completed" }));
      }

      // 2. Get flat_id
      const getFlatSql = `
        SELECT r.flat_id
        FROM maintenance_request mr
        JOIN resident r ON mr.resident_id = r.resident_id
        WHERE mr.request_id = ?
      `;

      db.query(getFlatSql, [request_id], (err, rows) => {
        if (err || rows.length === 0) {
          return db.rollback(() => res.status(500).json({ message: "Flat not found for this request" }));
        }

        const flat_id = rows[0].flat_id;

        // 3. Insert bill (Prevent duplicate with IGNORE or check, but schema has UNIQUE on request_id)
        const insertBillSql = `
          INSERT INTO maintenance_request_bill (request_id, flat_id, amount)
          VALUES (?, ?, ?)
        `;

        db.query(insertBillSql, [request_id, flat_id, cost], (err) => {
          if (err) {
            // Catch duplicate entry error specifically if needed, but general rollback covers it
            return db.rollback(() => res.status(500).json({ error: "Bill generation failed or already exists. " + err.message }));
          }

          // 4. Commit
          db.commit((err) => {
            if (err) {
              return db.rollback(() => res.status(500).json({ error: "Commit failed: " + err.message }));
            }

            res.json({ message: "Request completed and bill generated successfully" });
          });
        });
      });
    });
  });
});



module.exports = router;
