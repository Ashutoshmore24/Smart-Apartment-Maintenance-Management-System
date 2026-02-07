const db = require('./backend/db');

db.query('SHOW TABLES', (err, res) => {
    if (err) console.error(err);
    else console.log("Tables:", res);
    process.exit();
});
