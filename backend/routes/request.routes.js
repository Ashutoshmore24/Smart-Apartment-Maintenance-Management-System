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

// ============================
// Resident Dashboard Statistics
// ============================
router.get("/stats/resident/:resident_id", (req, res) => {
  const { resident_id } = req.params;

  // 1. Request-based counters
  const requestStatsSql = `
    SELECT
      COUNT(*) AS total_requests,
      SUM(status IN ('PENDING','IN_PROGRESS')) AS pending_actions,
      SUM(status = 'COMPLETED') AS resolved
    FROM maintenance_request
    WHERE resident_id = ?
  `;

  db.query(requestStatsSql, [resident_id], (err, reqStats) => {
    if (err) return res.status(500).json(err);

    const stats = reqStats[0];

    // 2. Pending payments (request-based billing)
    const paymentStatsSql = `
      SELECT COUNT(*) AS pending_payments
      FROM maintenance_request_bill
      WHERE payment_status = 'PENDING'
        AND flat_id = (
          SELECT flat_id FROM resident WHERE resident_id = ?
        )
    `;

    db.query(paymentStatsSql, [resident_id], (err2, payStats) => {
      if (err2) return res.status(500).json(err2);

      res.json({
        total_requests: stats.total_requests || 0,
        pending_actions: stats.pending_actions || 0,
        resolved: stats.resolved || 0,
        pending_payments: payStats[0].pending_payments || 0
      });
    });
  });
});

// ============================
// Auto Assign Technicians
// ============================
// ============================
// Auto Assign Technicians (Stable Version)
// ============================
router.post("/auto-assign", (req, res) => {

  const getUnassignedSql = `
    SELECT request_id, request_type
    FROM maintenance_request
    WHERE technician_id IS NULL
      AND status = 'PENDING'
  `;

  db.query(getUnassignedSql, (err, requests) => {
    if (err) return res.status(500).json({ error: err.message });

    if (requests.length === 0) {
      return res.json({ message: "No unassigned requests found." });
    }

    let assignedCount = 0;

    const assignNext = (index) => {
      if (index >= requests.length) {
        return res.json({
          message: `${assignedCount} request(s) auto-assigned successfully.`
        });
      }

      const request = requests[index];

      const findTechSql = `
        SELECT technician_id
        FROM technician
        WHERE specialization = ?
        LIMIT 1
      `;

      db.query(findTechSql, [request.request_type], (err2, techs) => {

        if (!err2 && techs.length > 0) {
          const technician_id = techs[0].technician_id;

          const updateSql = `
            UPDATE maintenance_request
            SET technician_id = ?, status = 'IN_PROGRESS'
            WHERE request_id = ?
          `;

          db.query(updateSql, [technician_id, request.request_id], (err3) => {
            if (!err3) assignedCount++;
            assignNext(index + 1);
          });

        } else {
          // No matching technician, skip
          assignNext(index + 1);
        }

      });
    };

    assignNext(0);
  });
});



module.exports = router;
