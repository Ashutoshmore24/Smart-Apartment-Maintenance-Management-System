const db = require('./backend/db');

db.query('SELECT * FROM asset', (err, res) => {
    if (err) console.error(err);
    else console.log("Assets:", res);
    process.exit();
});
