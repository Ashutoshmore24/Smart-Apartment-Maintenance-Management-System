const https = require("https");

const payload = JSON.stringify({
  resident_id: 1, // 'Amit Sharma' from seed.sql has ID 1
  request_type: "Plumbing",
  description: "Test diagnostic request from Antigravity",
  request_category: "FLAT",
  asset_id: null
});

const options = {
  hostname: "smart-apartment-system-production.up.railway.app",
  path: "/api/requests",
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
