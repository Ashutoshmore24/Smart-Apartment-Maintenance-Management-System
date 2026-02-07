const db = require('./backend/db');

const checkSchema = async () => {
    try {
        db.query('DESCRIBE resident', (err, res) => {
            if (err) console.error("Resident Error:", err);
            else console.log("Resident Schema:", res);
        });

        db.query('DESCRIBE technician', (err, res) => {
            if (err) console.error("Technician Error:", err);
            else console.log("Technician Schema:", res);
        });

        db.query('SHOW TABLES', (err, res) => {
            if (err) console.error("Tables Error:", err);
            else {
                console.log("All Tables:", res.map(t => Object.values(t)[0]));
                // Check if admin table exists
                if (res.some(t => Object.values(t)[0] === 'admin')) {
                    db.query('DESCRIBE admin', (err, res) => console.log("Admin Schema:", res));
                }
            }
            setTimeout(() => process.exit(), 1000);
        });

    } catch (error) {
        console.error(error);
    }
};

checkSchema();
