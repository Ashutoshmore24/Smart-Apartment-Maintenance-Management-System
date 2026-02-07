const db = require('./backend/db');

db.query('SELECT * FROM maintenance_bill LIMIT 5', (err, res) => {
    if (err) {
        console.error("Error with maintenance_bill:", err);
    } else {
        console.log("Maintenance Bills:", res);
    }
    process.exit();
});
