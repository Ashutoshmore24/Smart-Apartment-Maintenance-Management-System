const express = require("express");
const db = require("../db");

const router = express.Router();

// Add a payment (TRIGGER WILL FIRE)
router.post("/", (req, res) => {
  const { bill_id, amount, payment_mode } = req.body;

  const sql = `
    INSERT INTO payment (payment_date, amount, payment_mode, bill_id)
    VALUES (CURDATE(), ?, ?, ?)
  `;

  db.query(sql, [amount, payment_mode, bill_id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ message: "Payment added successfully" });
  });
});

module.exports = router;
