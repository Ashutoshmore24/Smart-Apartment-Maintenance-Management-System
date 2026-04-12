/* Everything Ready */
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

    db.query(`ALTER TABLE maintenance_request ADD COLUMN cost DECIMAL(10,2)`, (err) => {
        if (err && err.code !== 'ER_DUP_FIELDNAME') console.error("Migration warning (cost):", err.message);
    });

    db.query(`ALTER TABLE maintenance_request ADD COLUMN completed_at DATETIME`, (err) => {
        if (err && err.code !== 'ER_DUP_FIELDNAME') { 
            console.error("Migration warning (completed_at):", err.message);
        } else {
            console.log("SUCCESS: completed_at deployed");
        }
    });

    db.query(`ALTER TABLE maintenance_request MODIFY status DEFAULT 'PENDING'`, (err) => {
        if (err) console.error("Migration warning (status enum):", err.message);
    });

    db.query(`
        CREATE TABLE IF NOT EXISTS maintenance_request_bill (
            request_bill_id INT AUTO_INCREMENT PRIMARY KEY,
            request_id INT NOT NULL UNIQUE,
            flat_id INT NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            payment_status ENUM('PENDING','PAID') DEFAULT 'PENDING',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            paid_at DATETIME,
            CONSTRAINT fk_req_bill_request FOREIGN KEY (request_id) REFERENCES maintenance_request(request_id),
            CONSTRAINT fk_req_bill_flat FOREIGN KEY (flat_id) REFERENCES flat(flat_id)
        )
    `, (err) => {
        if (err) console.error("Migration warning (maintenance_request_bill):", err.message);
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

    // 5. Fix Payment Foreign Key (Point to Maintenance Request Bills)
    db.query(`ALTER TABLE payment DROP FOREIGN KEY payment_ibfk_1`, (err) => {
        if (err && err.code !== 'ER_CANT_DROP_FIELD_OR_KEY') {
            // If it fails for another reason, just log it
            // console.error("Migration log (drop fk):", err.message);
        }
        
        // Add new foreign key pointing to the correct bill table
        db.query(`
            ALTER TABLE payment 
            ADD CONSTRAINT fk_payment_request_bill 
            FOREIGN KEY (bill_id) REFERENCES maintenance_request_bill(request_bill_id)
        `, (err2) => {
            if (err2 && err2.code !== 'ER_DUP_CONSTRAINT_NAME') {
                if (err2.code !== 'ER_FK_CANNOT_DROP_PARENT') {
                    // Log error if it's not a common "already exists" error
                    // console.error("Migration warning (new fk):", err2.message);
                }
            } else if (!err2) {
                console.log("SUCCESS: Payment foreign key updated to maintenance_request_bill");
            }
        });
    });

    // 6. Make flat_id nullable in maintenance_request_bill
    db.query(`ALTER TABLE maintenance_request_bill MODIFY flat_id INT NULL`, (err) => {
        if (err) {
            // console.error("Migration warning (nullable flat_id):", err.message);
        } else {
            console.log("SUCCESS: maintenance_request_bill.flat_id is now nullable");
        }
    });

    console.log("Database migrations dispatched successfully!");
}

module.exports = runMigrations;
