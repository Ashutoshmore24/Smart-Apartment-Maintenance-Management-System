require("dotenv").config();
const db = require("./db");
const cors = require("cors");
const runMigrations = require("./migrations");
const express = require("express");

const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./utils/google");

const app = express(); // ✅ FIRST create app


const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://smart-apartment-maintenance-managem.vercel.app",
];
const extraOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : [];
if (process.env.FRONTEND_URL) {
  extraOrigins.push(process.env.FRONTEND_URL.trim());
}
const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / mobile apps
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

// 🔥 HANDLE PREFLIGHT (THIS IS WHAT YOU WERE MISSING)
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
// ✅ Middleware
app.use(passport.initialize());

// ✅ Routes
const assetRoutes = require("./routes/asset.routes");
const requestRoutes = require("./routes/request.routes");
const paymentRoutes = require("./routes/payment.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const notificationRoutes = require("./routes/notification.routes");

app.use("/api/assets", assetRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

// 🔐 Auth routes (separate)
app.use("/auth", authRoutes);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
console.log("DB_HOST:", process.env.DB_HOST);



app.get("/test", (req, res) => {
  res.send("Backend is working");
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({ error: err.message });
});

app.get("/debug", (req, res) => {
  db.query("SELECT * FROM technician", (err, result) => {
    if (err) {
      console.error("DEBUG ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// ✅ Server start
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});