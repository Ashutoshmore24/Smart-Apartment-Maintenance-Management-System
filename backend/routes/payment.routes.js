/* Everything Ready */
const express = require("express");
const db = require("../db");

const router = express.Router();

// ============================
// Get pending maintenance request bills for a resident
// ============================
router.get("/pending/:resident_id", (req, res) => {
  const { resident_id } = req.params;

  const sql = `
    SELECT b.request_bill_id, b.request_id, b.amount, b.created_at, b.flat_id, r.request_type, r.description
    FROM maintenance_request_bill b
    JOIN maintenance_request r ON b.request_id = r.request_id
    WHERE r.resident_id = ?
      AND b.payment_status = 'PENDING'
  `;

  db.query(sql, [resident_id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ============================
// Pay maintenance request bill (VALIDATE request_id)
// ============================
router.post("/pay", (req, res) => {
  const { request_id, flat_id, payment_mode, amount: sentAmount } = req.body;

  // 🛡️ Relaxed check: Since request_id is UNIQUE in maintenance_request_bill, 
  // we primarily rely on it. We allow flat_id to be NULL or missing.
  const checkSql = `
    SELECT request_bill_id, amount
    FROM maintenance_request_bill
    WHERE request_id = ?
      AND (flat_id = ? OR flat_id IS NULL OR ? IS NULL)
      AND payment_status = 'PENDING'
  `;

  db.query(checkSql, [request_id, flat_id, flat_id], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database query failed: " + err.message });

    if (rows.length === 0) {
      return res.status(403).json({
        message: "Invalid request ID or bill already paid"
      });
    }

    const bill_id = rows[0].request_bill_id;
    const amount = rows[0].amount;

    if (Number(sentAmount) !== Number(amount)) {
      return res.status(400).json({ message: "Incorrect payment amount." });
    }

    db.getConnection((err, connection) => {
      if (err) return res.status(500).json({ message: "Database connection failed" });

      connection.beginTransaction(err => {
        if (err) {
          connection.release();
          return res.status(500).json({ message: "Transaction failed" });
        }

        // 1️⃣ Insert payment
        const paySql = `
          INSERT INTO payment (payment_date, amount, payment_mode, bill_id)
          VALUES (CURDATE(), ?, ?, ?)
        `;

        connection.query(paySql, [amount, payment_mode, bill_id], err2 => {
          if (err2) {
            return connection.rollback(() => {
              connection.release();
              res.status(500).json({ message: "Payment failed. Please try again later." });
            });
          }

          // 2️⃣ Update bill status
          const updateSql = `
            UPDATE maintenance_request_bill
            SET payment_status = 'PAID',
                paid_at = NOW()
            WHERE request_bill_id = ?
          `;

          connection.query(updateSql, [bill_id], err3 => {
            if (err3) {
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ message: "Failed to update bill status." });
              });
            }

            connection.commit(err4 => {
              if (err4) {
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).json({ message: "Payment confirmation failed." });
                });
              }
              connection.release();
              res.json({ message: "Payment successful" });
            });
          });
        });
      });
    });
  });
});

// ============================
// Get payment history for a resident
// ============================
router.get("/history/:resident_id", (req, res) => {
  const { resident_id } = req.params;

  const sql = `
    SELECT p.payment_id, p.payment_date, p.amount, 
           r.request_id, r.request_type, r.request_category,
           res.name AS resident_name,
           t.name AS technician_name,
           p.payment_mode
    FROM payment p
    JOIN maintenance_request_bill b ON p.bill_id = b.request_bill_id
    JOIN maintenance_request r ON b.request_id = r.request_id
    LEFT JOIN resident res ON r.resident_id = res.resident_id
    LEFT JOIN technician t ON r.technician_id = t.technician_id
    WHERE r.resident_id = ?
    ORDER BY p.payment_id DESC
    LIMIT 20
  `;

  db.query(sql, [resident_id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
