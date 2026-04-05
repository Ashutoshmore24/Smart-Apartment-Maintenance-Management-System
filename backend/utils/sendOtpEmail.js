const nodemailer = require("nodemailer");

function otpEmailHtml(otp) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Smart Apartment System</h2>
      <p style="font-size: 16px; color: #555;">Hello,</p>
      <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) for login is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 28px; letter-spacing: 5px; font-weight: bold; color: #2E86DE;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #777;">This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
      <hr style="margin: 20px 0;" />
      <p style="font-size: 12px; color: #aaa; text-align: center;">If you did not request this, please ignore this email.</p>
    </div>`;
}

let transporter;

/**
 * Gmail SMTP via Nodemailer (demo/dev).
 * Set on the server (e.g. Render):
 *   SMTP_EMAIL   — full Gmail address (the dedicated account)
 *   SMTP_PASS    — Google App Password (16 chars, not your normal Gmail password)
 * https://myaccount.google.com/apppasswords — requires 2-Step Verification on the Google account.
 */
function getTransporter() {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASS) return null;
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS,
            },
            connectionTimeout: 60000,
            greetingTimeout: 30000,
            socketTimeout: 60000,
        });
    }
    return transporter;
}

/**
 * Sends OTP to any recipient email (Gmail SMTP allows this once authenticated).
 * @returns {Promise<{ provider: string }|null>}
 */
async function sendOtpEmail(to, otp) {
    const transport = getTransporter();
    if (!transport) {
        console.warn(
            "SMTP not configured: set SMTP_EMAIL and SMTP_PASS (Gmail + App Password). OTP:",
            otp
        );
        return null;
    }

    await transport.sendMail({
        from: `"Smart Apartment System" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: "Your OTP Code - Smart Apartment System",
        html: otpEmailHtml(otp),
    });

    return { provider: "gmail-smtp" };
}

module.exports = { sendOtpEmail, otpEmailHtml };
