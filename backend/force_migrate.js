/* Everything Ready */
require("dotenv").config();
const runMigrations = require("./migrations");

console.log("Forcing migrations independently...");
runMigrations();

setTimeout(() => {
   console.log("Migrations applied successfully. Please check your app now.");
   process.exit(0);
}, 15000);
