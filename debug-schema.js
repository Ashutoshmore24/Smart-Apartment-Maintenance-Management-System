const db = require('./backend/db');

db.query('DESCRIBE payment', (err, res) => {
    if (err) console.error(err);
    else console.log("Payment Schema:", res);

    // Also check maintenance_request schema to see if it has bill related info
    db.query('DESCRIBE maintenance_request', (err2, res2) => {
        if (err2) console.error(err2);
        else console.log("Request Schema:", res2);
        process.exit();
    });
});
