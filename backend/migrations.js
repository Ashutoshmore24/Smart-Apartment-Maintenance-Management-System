const db = require("./db");

function runMigrations() {
    console.log("Running automatic database migrations...");

    // 1. Add priority to maintenance_request
    db.query(`ALTER TABLE maintenance_request ADD COLUMN priority ENUM('NORMAL', 'HIGH', 'EMERGENCY') DEFAULT 'NORMAL'`, (err) => {
        if (err && err.code !== 'ER_DUP_FIELDNAME') console.error("Migration warning (priority):", err.message);
    });

    db.query(`ALTER TABLE maintenance_request ADD COLUMN request_category VARCHAR(50) DEFAULT 'FLAT'`, (err) => {
        if (err && err.code !== 'ER_DUP_FIELDNAME') console.error("Migration warning (category):", err.message);
    });

    db.query(`ALTER TABLE maintenance_request ADD COLUMN asset_id INT DEFAULT NULL`, (err) => {
        if (err && err.code !== 'ER_DUP_FIELDNAME') console.error("Migration warning (asset_id):", err.message);
    });

    // 2. Add status to technician
    db.query(`ALTER TABLE technician ADD COLUMN status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING'`, (err) => {
        if (err && err.code !== 'ER_DUP_FIELDNAME') console.error("Migration warning (tech status):", err.message);
    });

    // 3. Add columns to resident
    db.query(`ALTER TABLE resident ADD COLUMN is_first_login INT DEFAULT 1`, (err) => {
        if (err && err.code !== 'ER_DUP_FIELDNAME') console.error("Migration warning (resident 1):", err.message);
    });
    db.query(`ALTER TABLE resident ADD COLUMN google_id VARCHAR(255)`, (err) => {
        if (err && err.code !== 'ER_DUP_FIELDNAME') console.error("Migration warning (resident 2):", err.message);
    });
    db.query(`ALTER TABLE resident ADD COLUMN avatar_url VARCHAR(255)`, (err) => {
        if (err && err.code !== 'ER_DUP_FIELDNAME') console.error("Migration warning (resident 3):", err.message);
    });

    // 4. Create notifications table
    db.query(`
        CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_type ENUM('RESIDENT', 'TECHNICIAN', 'ADMIN') NOT NULL,
            user_id INT NOT NULL,
            message VARCHAR(255) NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("Migration warning (notifications):", err.message);
    });

    console.log("Database migrations dispatched successfully!");
}

module.exports = runMigrations;
