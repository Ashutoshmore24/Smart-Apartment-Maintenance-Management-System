const db = require('./backend/db');

db.query('SHOW TRIGGERS', (err, res) => {
    if (err) console.error(err);
    else console.log("Triggers:", res);
    process.exit();
});
