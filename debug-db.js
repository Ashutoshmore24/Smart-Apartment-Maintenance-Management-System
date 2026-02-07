const db = require('./backend/db');

console.log("Checking database...");

db.query('SELECT * FROM payment LIMIT 1', (err, res) => {
    if (err) console.error("Error reading payments:", err);
    else console.log("Payments table access ok. Sample:", res);
});

// Check if bill table exists and has data
db.query('SELECT * FROM bill LIMIT 5', (err, res) => {
    if (err) {
        console.error("Error reading bills:", err);
        console.log("This confirms why payments might fail if 'bill_id' constraint exists.");
    }
    else {
        console.log("Bills found:", res);
        console.log("Please use one of these Bill IDs to test payment.");
    }
    process.exit();
});
