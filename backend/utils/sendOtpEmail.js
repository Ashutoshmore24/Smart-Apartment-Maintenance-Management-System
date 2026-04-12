/* Everything Ready */
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

/**
 * Sends OTP via Brevo API (HTTP) which bypasses Render's SMTP block entirely.
 * Requires BREVO_API_KEY in the environment variables.
 * @returns {Promise<{ provider: string }|null>}
 */
async function sendOtpEmail(to, otp) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SMTP_EMAIL || "support.smartstay2026@gmail.com";
    
    if (!apiKey) {
        console.warn("Email API not configured: set BREVO_API_KEY in environment variables. OTP:", otp);
        return null;
    }

    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: { 
                    name: "Smart Apartment", 
                    email: senderEmail 
                },
                to: [{ email: to }],
                subject: "Your OTP Code - Smart Apartment System",
                htmlContent: otpEmailHtml(otp)
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Brevo HTTP Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        return { provider: "brevo-http" };
    } catch (error) {
        console.error("sendOtpEmail Error:", error.message);
        throw error;
    }
}

module.exports = { sendOtpEmail, otpEmailHtml };
