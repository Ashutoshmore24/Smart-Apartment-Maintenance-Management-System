const db = require("./db");

async function fix() {
    try {
        await db.promise().query("ALTER TABLE otp_verifications DROP FOREIGN KEY fk_otp_user;");
        console.log("FK dropped.");
    } catch (e) {
        if (e.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
            console.log("FK didn't exist or already dropped.");
        } else {
            console.error(e);
        }
    }
    process.exit(0);
}
fix();
