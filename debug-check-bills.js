const db = require('./backend/db');

db.query('SELECT * FROM maintenance_request_bill', (err, res) => {
    if (err) console.error(err);
    else console.log("Bills:", res);
    process.exit();
});
