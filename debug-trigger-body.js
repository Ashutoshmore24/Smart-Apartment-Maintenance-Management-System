const db = require('./backend/db');

db.query(`
    SELECT ACTION_STATEMENT 
    FROM information_schema.TRIGGERS 
    WHERE TRIGGER_SCHEMA = 'smart_apartment_db' 
    AND EVENT_OBJECT_TABLE = 'payment'
`, (err, res) => {
    if (err) console.error(err);
    else console.log("Trigger Body:", res);
    process.exit();
});
