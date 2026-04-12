/* Everything Ready */
const http = require("http");

const data = JSON.stringify({
  resident_id: 1,
  request_type: "Plumbing",
  description: "Test description from HTTP",
  category: "FLAT",
  asset_id: null
});

const options = {
  hostname: "localhost",
  port: 8080,
  path: "/api/requests",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

const req = http.request(options, (res) => {
  let body = "";
  res.on("data", (chunk) => {
    body += chunk.toString();
  });
  res.on("end", () => {
    console.log("STATUS:", res.statusCode);
    console.log("RESPONSE BODY:", body);
  });
});

req.on("error", (e) => {
  console.error("HTTP REQUEST ERROR:", e.message);
});

req.write(data);
req.end();
