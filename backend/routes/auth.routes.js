// backend/routes/auth.routes.js
const FRONTEND_URL =
  process.env.FRONTEND_URL ||
    "https://smart-apartment-maintena-git-bc4b50-ashutoshs-projects-41c64a00.vercel.app";

const express = require("express");
const passport = require("passport");

const router = express.Router();

const {
    googleCallback,
    verifyOtp,
    getMe,
    logout
} = require("../controllers/auth.controller");

// ─────────────────────────────────────────────
// 🔹 GOOGLE AUTH
// ─────────────────────────────────────────────

// Step 1: Redirect user to Google
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

// Step 2: Google redirects back here
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${FRONTEND_URL}/login` || "https://smart-apartment-maintena-git-bc4b50-ashutoshs-projects-41c64a00.vercel.app/login"
    }),
    googleCallback
);

// ─────────────────────────────────────────────
// 🔹 OTP AND SESSION
// ─────────────────────────────────────────────

router.post("/verify-otp", verifyOtp);
router.get("/me", getMe);
router.post("/logout", logout);



// ─────────────────────────────────────────────
// 🔹 OPTIONAL TEST ROUTE (for debugging)
// ─────────────────────────────────────────────
router.get("/test", (req, res) => {
    res.send("Auth routes working ✅");
});


// ─────────────────────────────────────────────
module.exports = router;