const db = require('./backend/db');

async function fixSchema() {
    console.log("--- Fixing Schema ---");

    // 1. Drop old FK
    console.log("Dropping FK 'payment_ibfk_1'...");
    db.query("ALTER TABLE payment DROP FOREIGN KEY payment_ibfk_1", (err) => {
        if (err) {
            console.error("Error dropping FK (might not exist):", err.message);
        } else {
            console.log("Dropped old FK.");
        }

        // 2. Add new FK
        console.log("Adding new FK to 'maintenance_request_bill'...");
        // Note: payment.bill_id -> maintenance_request_bill.request_bill_id
        const sql = `
            ALTER TABLE payment
            ADD CONSTRAINT fk_payment_request_bill
            FOREIGN KEY (bill_id) REFERENCES maintenance_request_bill(request_bill_id)
            ON DELETE CASCADE
        `;

        db.query(sql, (err) => {
            if (err) {
                console.error("Error adding new FK:", err.message);
            } else {
                console.log("Successfully added new FK 'fk_payment_request_bill'.");
            }
            process.exit();
        });
    });
}

fixSchema();
