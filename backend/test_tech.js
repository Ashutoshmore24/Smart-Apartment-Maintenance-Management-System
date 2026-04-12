/* Everything Ready */
require("dotenv").config();
const db = require("./db");

async function check() {
    try {
        const [res] = await db.promise().query("SHOW TABLES LIKE 'maintenance_request_bill'");
        console.log("Bill table exists:", res.length > 0);
    } catch(e) {
        console.error("DB Error:", e);
    }
    process.exit(0);
}
check();
