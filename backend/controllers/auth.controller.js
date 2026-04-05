const FRONTEND_URL =
  process.env.FRONTEND_URL ||
    "https://smart-apartment-maintenance-managem.vercel.app";

const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// 🔹 Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 🔹 Mail transporter (timeouts avoid hanging background sends forever)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
});


// 🔹 Google callback controller
exports.googleCallback = async (req, res) => {
    try {
        console.log("🔥 Google Callback HIT");
        
        if (!req.user) {
            console.error("❌ req.user is undefined");
            return res.redirect(`${FRONTEND_URL}/login`);
        }

        console.log("User:", req.user);


        const { id, displayName, emails, photos } = req.user;

        const email = emails?.[0]?.value;

        
        if (!email) {
            console.error("❌ Email not found in Google profile:", req.user);
            return res.redirect(`${FRONTEND_URL}/login`);
        
        }
        const avatar = photos?.[0]?.value;

        // 🔍 Check resident
        const [result] = await db.promise().query("SELECT * FROM resident WHERE email = ?", [email]);

        let user;

        // 🆕 First time user
        if (result.length === 0) {
            const [insertRes] = await db.promise().query(
                "INSERT INTO resident (name, email, google_id, avatar_url, is_first_login, status) VALUES (?, ?, ?, ?, 0, 'ACTIVE')",
                [displayName, email, id, avatar]
            );

            const token = jwt.sign(
                { id: insertRes.insertId },
                process.env.JWT_SECRET || "defaultsecret",
                { expiresIn: "1d" }
            );

            res.cookie("token", token, { httpOnly: true, secure: true, path: "/", sameSite: "none" });
            res.redirect(`${FRONTEND_URL}/auth-success`);
        }
        // 🔁 Existing user (resident)
        else {
            user = result[0];

            // is_first_login === 0 → require OTP on each Google login (MySQL may return string/number)
            const needsOtp = Number(user.is_first_login) === 0;

            if (needsOtp) {
                const otp = generateOTP();
                const hash = await bcrypt.hash(otp, 10);
                const expires = new Date(Date.now() + 5 * 60 * 1000);

                await db.promise().query(
                    "INSERT INTO otp_verifications (user_id, otp_hash, expires_at) VALUES (?, ?, ?)",
                    [user.resident_id, hash, expires]
                );

                // Redirect immediately — do NOT await SMTP; Gmail from cloud hosts often times out (ETIMEDOUT)
                // and would block the user on a blank loading screen for the whole connection timeout.
                res.redirect(`${FRONTEND_URL}/otp?userId=${user.resident_id}`);

                setImmediate(() => {
                    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASS) {
                        console.warn("SMTP_EMAIL / SMTP_PASS not set — OTP email not sent. OTP:", otp);
                        return;
                    }
                    transporter
                        .sendMail({
                            from: `"Smart Apartment System" <${process.env.SMTP_EMAIL}>`,
                            to: email,
                            subject: "Your OTP Code - Smart Apartment System",
                            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      
      <h2 style="color: #333; text-align: center;">
        Smart Apartment System
      </h2>

      <p style="font-size: 16px; color: #555;">
        Hello,
      </p>

      <p style="font-size: 16px; color: #555;">
        Your One-Time Password (OTP) for login is:
      </p>

      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 28px; letter-spacing: 5px; font-weight: bold; color: #2E86DE;">
          ${otp}
        </span>
      </div>

      <p style="font-size: 14px; color: #777;">
        This OTP is valid for 5 minutes. Please do not share it with anyone.
      </p>

      <hr style="margin: 20px 0;" />

      <p style="font-size: 12px; color: #aaa; text-align: center;">
        If you did not request this, please ignore this email.
      </p>

    </div>
  `,
                        })
                        .catch((mailErr) => {
                            console.error("Mail sending failed:", mailErr);
                            console.log("⚠️ OTP (copy from logs if email failed):", otp);
                        });
                });

                return;
            }
            // 👉 First login → skip OTP
            else {
                await db.promise().query("UPDATE resident SET is_first_login = 1 WHERE resident_id = ?", [user.resident_id]);

                const token = jwt.sign(
                    { id: user.resident_id },
                    process.env.JWT_SECRET || "defaultsecret",
                    { expiresIn: "1d" }
                );

                res.cookie("token", token, { httpOnly: true, secure: true, path: "/", sameSite: "none" });
                res.redirect(`${FRONTEND_URL}/auth-success`);
            }
        }
    } catch (error) {
        console.error("Auth error:", error);
        return res.redirect(`${FRONTEND_URL}/login`);
    }
};

// 🔹 OTP verification
exports.verifyOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const [result] = await db.promise().query(
            "SELECT * FROM otp_verifications WHERE user_id = ? ORDER BY id DESC LIMIT 1",
            [userId]
        );

        if (result.length === 0) return res.status(400).json({ message: "OTP not found" });

        const record = result[0];

        // ❌ expired
        if (new Date() > record.expires_at) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const valid = await bcrypt.compare(otp, record.otp_hash);

        if (!valid) return res.status(400).json({ message: "Invalid OTP" });

        // ✅ success → generate token
        const token = jwt.sign(
            { id: userId },
            process.env.JWT_SECRET || "defaultsecret",
            { expiresIn: "1d" }
        );

        res.cookie("token", token, { httpOnly: true, secure: true, path: "/", sameSite: "none" });

        return res.json({ message: "Login successful" });
    } catch (err) {
        console.error("OTP Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// 🔹 Get current user (me)
exports.getMe = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");

        const [result] = await db.promise().query("SELECT * FROM resident WHERE resident_id = ?", [decoded.id]);

        if (result.length === 0) return res.status(404).json({ message: "User not found" });

        const user = result[0];
        const formattedUser = {
            ...user,
            role: "resident"
        };
        res.json({ user: formattedUser, role: "resident" });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// 🔹 Logout (match cookie options used when setting token, for cross-site browsers)
exports.logout = (req, res) => {
    res.clearCookie("token", {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.json({ message: "Logged out successfully" });
};