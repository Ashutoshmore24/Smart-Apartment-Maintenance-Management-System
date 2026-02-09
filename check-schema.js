const db = require('./backend/db');

async function checkSchema() {
    console.log("--- Checking Tables ---");
    db.query("SHOW TABLES", (err, tables) => {
        if (err) console.error(err);
        else {
            console.log("Tables:", tables.map(t => Object.values(t)[0]));

            console.log("\n--- Checking 'payment' Constraints ---");
            db.query("SELECT * FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'payment' AND TABLE_SCHEMA = 'smart_apartment_db'", (err, keys) => {
                if (err) console.error(err);
                else {
                    console.table(keys.map(k => ({
                        CONSTRAINT_NAME: k.CONSTRAINT_NAME,
                        COLUMN_NAME: k.COLUMN_NAME,
                        REFERENCED_TABLE_NAME: k.REFERENCED_TABLE_NAME,
                        REFERENCED_COLUMN_NAME: k.REFERENCED_COLUMN_NAME
                    })));

                    console.log("\n--- Checking 'maintenance_request_bill' Columns ---");
                    db.query("SHOW COLUMNS FROM maintenance_request_bill", (err, cols) => {
                        if (err) console.error(err);
                        else {
                            console.table(cols);
                            process.exit();
                        }
                    });
                }
            });
        }
    });
}

checkSchema();
