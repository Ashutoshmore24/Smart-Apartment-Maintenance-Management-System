/* Everything Ready */
const https = require("https");

const payload = JSON.stringify({
  name: "Tech Test",
  phone_number: "9999999999",
  specialization: "Plumbing"
});

const options = {
  hostname: "smart-apartment-system-production.up.railway.app",
  path: "/api/users/register/technician",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  let body = "";
  console.log(`STATUS: ${res.statusCode}`);
  res.on("data", (chunk) => body += chunk);
  res.on("end", () => console.log("BODY:", body));
});

req.on("error", (e) => console.error(e));
req.write(payload);
req.end();
