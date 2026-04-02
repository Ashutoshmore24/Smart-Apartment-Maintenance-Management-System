const db = require("./db");

async function run() {
    try {
        // Add columns if they don't exist
        await db.promise().query(`
            ALTER TABLE resident 
            ADD COLUMN is_first_login INT DEFAULT 1,
            ADD COLUMN google_id VARCHAR(255),
            ADD COLUMN avatar_url VARCHAR(255)
        `).catch(err => {
            if (err.code !== 'ER_DUP_FIELDNAME') throw err;
            console.log("Columns already exist");
        });

        console.log("Database altered successfully");

        process.exit(0);
    } catch(e) {
        console.error("DB Alter error:", e);
        process.exit(1);
    }
}
run();
