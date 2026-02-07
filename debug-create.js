const db = require('./backend/db');

db.query('SHOW CREATE TABLE payment', (err, res) => {
    if (err) console.error(err);
    else console.log(res[0]['Create Table']);
    process.exit();
});
