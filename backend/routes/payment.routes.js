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
  const { request_id, flat_id, payment_mode } = req.body;

  // 1️⃣ Validate bill exists and belongs to flat
  const checkSql = `
    SELECT request_bill_id
    FROM maintenance_request_bill
    WHERE request_id = ?
      AND flat_id = ?
      AND payment_status = 'PENDING'
  `;

  db.query(checkSql, [request_id, flat_id], (err, rows) => {
    if (err) return res.status(500).json(err);

    if (rows.length === 0) {
      return res.status(403).json({
        message: "Invalid request ID or bill already paid"
      });
    }

    const bill_id = rows[0].request_bill_id;

    // 2️⃣ Insert payment
    const paySql = `
      INSERT INTO payment (payment_date, amount, payment_mode, bill_id)
      VALUES (CURDATE(),
        (SELECT amount FROM maintenance_request_bill WHERE request_bill_id = ?),
        ?, ?
      )
    `;

    db.query(paySql, [bill_id, payment_mode, bill_id], (err2) => {
      if (err2) {
        return res.status(500).json({
          message: "Payment failed",
          sqlMessage: err2.sqlMessage
        });
      }

      // 3️⃣ Mark bill as PAID
      db.query(
        `UPDATE maintenance_request_bill
         SET payment_status = 'PAID',
             paid_at = NOW()
         WHERE request_bill_id = ?`,
        [bill_id]
      );

      res.json({ message: "Payment successful" });
    });
  });
});

module.exports = router;
