const db = require("./db");

async function check() {
    try {
        const [tables] = await db.promise().query("SHOW TABLES");
        console.log("TABLES:", JSON.stringify(tables, null, 2));
        
        const [resDesc] = await db.promise().query("DESCRIBE resident");
        console.log("RESIDENT:", JSON.stringify(resDesc, null, 2));

        const [usersDesc] = await db.promise().query("DESCRIBE users");
        console.log("USERS:", JSON.stringify(usersDesc, null, 2));

        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
check();
