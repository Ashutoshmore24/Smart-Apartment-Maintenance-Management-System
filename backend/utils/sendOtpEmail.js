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

let smtpTransporter;

function getSmtpTransporter() {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASS) return null;
    if (!smtpTransporter) {
        smtpTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS,
            },
            connectionTimeout: 15000,
            greetingTimeout: 10000,
            socketTimeout: 20000,
        });
    }
    return smtpTransporter;
}

/**
 * Resend HTTPS API — works reliably from Render (no SMTP port blocking).
 * Set RESEND_API_KEY on the host. Optionally RESEND_FROM (must be a verified sender/domain in Resend).
 */
async function sendViaResend(to, otp) {
    const html = otpEmailHtml(otp);
    const from =
        process.env.RESEND_FROM || "Smart Apartment <onboarding@resend.dev>";
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to: [to],
            subject: "Your OTP Code - Smart Apartment System",
            html,
        }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = data.message || JSON.stringify(data);
        throw new Error(`Resend API error (${res.status}): ${msg}`);
    }
    return { provider: "resend", id: data.id };
}

async function sendViaSmtp(to, otp) {
    const transport = getSmtpTransporter();
    if (!transport) return null;
    await transport.sendMail({
        from: `"Smart Apartment System" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: "Your OTP Code - Smart Apartment System",
        html: otpEmailHtml(otp),
    });
    return { provider: "smtp" };
}

/**
 * Sends OTP email. Prefers Resend (API) when RESEND_API_KEY is set; otherwise Gmail SMTP if configured.
 * @returns {Promise<{ provider: string }|null>}
 */
async function sendOtpEmail(to, otp) {
    if (process.env.RESEND_API_KEY) {
        return sendViaResend(to, otp);
    }
    const smtp = await sendViaSmtp(to, otp);
    if (smtp) return smtp;

    console.warn(
        "No email provider: set RESEND_API_KEY (recommended) or SMTP_EMAIL + SMTP_PASS. OTP:",
        otp
    );
    return null;
}

module.exports = { sendOtpEmail, otpEmailHtml };
