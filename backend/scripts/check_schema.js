const db = require('../db');
db.query("SHOW COLUMNS FROM maintenance_request", (err, result) => {
    console.log(JSON.stringify(result, null, 2));
    process.exit();
});
