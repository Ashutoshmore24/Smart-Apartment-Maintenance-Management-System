const express = require("express");
const db = require("../db");
const { createNotification } = require("../controllers/notification.controller");

const router = express.Router();

// ============================
// Get all maintenance requests
// ============================
router.get("/", (req, res) => {
  const sql = `
        SELECT mr.*, 
               r.name AS resident_name, 
               r.phone_number AS resident_phone, 
               r.email AS resident_email, 
               r.flat_id AS resident_flat_id,
               t.name AS technician_name 
        FROM maintenance_request mr
        JOIN resident r ON mr.resident_id = r.resident_id
        LEFT JOIN technician t ON mr.technician_id = t.technician_id
        ORDER BY mr.request_id DESC
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
    priority = "NORMAL",
    request_category = "FLAT",
    asset_id = null
  } = req.body;

  if (!description || description.trim() === "") {
    return res.status(400).json({ message: "Description cannot be empty" });
  }

  const sql = `
    INSERT INTO maintenance_request
    (resident_id, request_type, description, priority, status, request_date, request_category, asset_id)
  VALUES(?, ?, ?, ?, 'PENDING', CURDATE(), ?, ?)
    `;

  db.query(
    sql,
    [resident_id, request_type, description, priority, request_category, asset_id],
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

  // 🛡️ PREVENT MODIFICATION OF COMPLETED REQUESTS
  db.query("SELECT status FROM maintenance_request WHERE request_id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length > 0 && rows[0].status === 'COMPLETED') {
        return res.status(400).json({ message: "Completed requests cannot be modified." });
    }

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

      // Notification Logic
      const getResidentSql = `SELECT resident_id FROM maintenance_request WHERE request_id = ?`;
      db.query(getResidentSql, [id], (err2, rows) => {
        if (!err2 && rows.length > 0) {
          const resident_id = rows[0].resident_id;
          if (technician_id) {
            createNotification('TECHNICIAN', technician_id, `You have been assigned to request #${id}`).catch(console.error);
          }
          if (status) {
            createNotification('RESIDENT', resident_id, `Status of request #${id} updated to ${status}`).catch(console.error);
          }
        }
        res.json({ message: "Request updated successfully" });
      });
    });
  });
});


// ============================
// Technician completes request (COST + BILL)
// ============================
router.put("/complete/:request_id", (req, res) => {
  const { request_id } = req.params;
  let { cost } = req.body;

  // Ensure cost is a valid number
  const numericCost = Number(cost);

  if (isNaN(numericCost) || numericCost <= 0 || numericCost > 100000) {
    return res.status(400).json({ message: "Valid cost between 1 and 100,000 is required" });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ message: err.message });

    // 1. Update request status and cost
    const updateSql = `
      UPDATE maintenance_request
      SET status = 'COMPLETED', cost = ?, completed_at = NOW()
      WHERE request_id = ? AND status != 'COMPLETED'
    `;

    db.query(updateSql, [numericCost, request_id], (err, result) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ message: err.message }));
      }

      if (result.affectedRows === 0) {
        return db.rollback(() => res.status(400).json({ message: "Request not found or already completed" }));
      }

      // 2. Get flat_id (Use LEFT JOIN so Asset requests don't fail!)
      const getFlatSql = `
        SELECT mr.resident_id, r.flat_id
        FROM maintenance_request mr
        LEFT JOIN resident r ON mr.resident_id = r.resident_id
        WHERE mr.request_id = ?
    `;

      db.query(getFlatSql, [request_id], (err, rows) => {
        if (err || rows.length === 0) {
          return db.rollback(() => res.status(500).json({ message: "Request info not found for billing" }));
        }

        const flat_id = rows[0].flat_id;
        const resident_id = rows[0].resident_id;

        const completeWithoutBill = () => {
          db.commit((err) => {
            if (err) {
              return db.rollback(() => res.status(500).json({ message: "Commit failed: " + err.message }));
            }
            if (resident_id) {
                createNotification('RESIDENT', resident_id, `Request #${request_id} completed. Cost Rs. ${numericCost}`).catch(console.error);
            }
            res.json({ message: "Request completed successfully" });
          });
        };

        // If no flat_id exists (e.g. Asset task), just complete without billing
        if (!flat_id) {
           return completeWithoutBill();
        }

        // 3. Insert bill (Prevent duplicate with IGNORE or check, but schema has UNIQUE on request_id)
        const insertBillSql = `
          INSERT INTO maintenance_request_bill(request_id, flat_id, amount)
  VALUES(?, ?, ?)
    `;

        db.query(insertBillSql, [request_id, flat_id, numericCost], (err) => {
          if (err) {
            return db.rollback(() => res.status(500).json({ message: "Bill generation failed. " + err.message }));
          }

          completeWithoutBill();
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
    SUM(status IN('PENDING', 'IN_PROGRESS')) AS pending_actions,
      SUM(status = 'COMPLETED') AS resolved
    FROM maintenance_request
    WHERE resident_id = ?
    `;

  db.query(requestStatsSql, [resident_id], (err, reqStats) => {
    if (err) return res.status(500).json(err);

    const stats = reqStats[0];

    // 2. Pending payments (request-based billing)
    const paymentStatsSql = `
      SELECT COUNT(b.request_bill_id) AS pending_payments
      FROM maintenance_request_bill b
      JOIN maintenance_request r ON b.request_id = r.request_id
      WHERE b.payment_status = 'PENDING'
        AND r.resident_id = ?
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
    SELECT request_id, request_type, resident_id
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
          message: `${assignedCount} request(s) auto - assigned successfully.`
        });
      }

      const request = requests[index];

      const findTechSql = `
        SELECT technician_id
        FROM technician
        WHERE specialization = ?
    OR specialization = 'General' 
           OR specialization = 'General Maintenance' 
           OR specialization IS NULL 
           OR specialization = ''
        ORDER BY CASE WHEN specialization = ? THEN 0 ELSE 1 END
        LIMIT 1
    `;

      db.query(findTechSql, [request.request_type, request.request_type], (err2, techs) => {

        if (!err2 && techs.length > 0) {
          const technician_id = techs[0].technician_id;

          const updateSql = `
            UPDATE maintenance_request
            SET technician_id = ?, status = 'IN_PROGRESS'
            WHERE request_id = ?
    `;

          db.query(updateSql, [technician_id, request.request_id], (err3) => {
            if (!err3) {
                assignedCount++;
                createNotification('TECHNICIAN', technician_id, `You were auto-assigned to request #${request.request_id}`).catch(console.error);
                createNotification('RESIDENT', request.resident_id, `Request #${request.request_id} auto-assigned to technician`).catch(console.error);
            }
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

// ============================
// Technician Performance Stats
// ============================
router.get("/tech-stats/:technician_id", (req, res) => {
  const { technician_id } = req.params;

  const sql = `
    SELECT 
      COUNT(*) AS total_assigned,
      SUM(CASE WHEN status = 'COMPLETED' AND DATE(completed_at) = CURDATE() THEN 1 ELSE 0 END) AS completed_today,
      SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS total_completed,
      ROUND(AVG(
        CASE WHEN status = 'COMPLETED' THEN TIMESTAMPDIFF(HOUR, request_date, completed_at) ELSE NULL END
      ), 1) AS avg_completion_hours
    FROM maintenance_request
    WHERE technician_id = ?
  `;

  db.query(sql, [technician_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length === 0) {
       return res.json({ completed_today: 0, avg_completion_hours: 0, efficiency_percentage: 100 });
    }

    const row = results[0];
    const total_assigned = row.total_assigned || 0;
    const total_completed = row.total_completed || 0;
    const completed_today = row.completed_today || 0;
    const avg_completion_hours = row.avg_completion_hours || 0;

    let efficiency_percentage = 100;
    if (total_assigned > 0) {
       efficiency_percentage = Math.round((total_completed / total_assigned) * 100);
    }

    res.json({
      completed_today,
      avg_completion_hours,
      efficiency_percentage
    });
  });
});

// ============================
// Get requests for specific technician
// ============================
router.get("/technician/:technician_id", (req, res) => {
  const { technician_id } = req.params;

  const sql = `
    SELECT mr.*, 
           r.name AS resident_name, 
           r.phone_number AS resident_phone, 
           r.email AS resident_email, 
           r.flat_id AS resident_flat_id
    FROM maintenance_request mr
    LEFT JOIN resident r ON mr.resident_id = r.resident_id
    WHERE mr.technician_id = ?
    ORDER BY mr.request_id DESC
  `;

  db.query(sql, [technician_id], (err, results) => {
    if (err) {
      console.error("TECH REQUEST ERROR:", err);
      return res.json([]); // safe fallback
    }
    res.json(results);
  });
});

// ============================
// Admin Dashboard Analysis Stats
// ============================
router.get("/stats/admin", (req, res) => {
  const statusSql = `SELECT status, COUNT(*) as count FROM maintenance_request GROUP BY status`;
  const categorySql = `SELECT request_category, COUNT(*) as count FROM maintenance_request GROUP BY request_category`;
  
  const trendsSql = `
    SELECT DATE(request_date) as date, COUNT(*) as count 
    FROM maintenance_request 
    WHERE request_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY DATE(request_date)
    ORDER BY date ASC
  `;

  const techPerfSql = `
    SELECT t.name, 
           COUNT(mr.request_id) as total_tasks,
           SUM(CASE WHEN mr.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_tasks
    FROM technician t
    LEFT JOIN maintenance_request mr ON t.technician_id = mr.technician_id
    GROUP BY t.technician_id
  `;

  const financeSql = `
    SELECT DATE(completed_at) as date, SUM(cost) as total_cost
    FROM maintenance_request
    WHERE status = 'COMPLETED' AND completed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY DATE(completed_at)
    ORDER BY date ASC
  `;

  db.query(statusSql, (err1, statusResults) => {
    if (err1) return res.status(500).json(err1);
    
    db.query(categorySql, (err2, categoryResults) => {
      if (err2) return res.status(500).json(err2);
      
      db.query(trendsSql, (err3, trendsResults) => {
        if (err3) return res.status(500).json(err3);
        
        db.query(techPerfSql, (err4, techPerfResults) => {
          if (err4) return res.status(500).json(err4);
          
          db.query(financeSql, (err5, financeResults) => {
            if (err5) return res.status(500).json(err5);
            
            res.json({
              statusStats: statusResults,
              categoryStats: categoryResults,
              requestTrends: trendsResults,
              techPerformance: techPerfResults,
              financialTrends: financeResults
            });
          });
        });
      });
    });
  });
});


module.exports = router;