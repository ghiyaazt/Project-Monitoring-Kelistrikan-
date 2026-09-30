const nodemailer = require("nodemailer");

// Create transporter untuk Gmail
const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Email Gmail kamu
            pass: process.env.EMAIL_PASS  // App Password dari Google
        }
    });
};

// Template email OTP
const getOTPEmailTemplate = (otpCode, purpose) => {
    const purposeText = {
        register: "Registrasi Akun",
        email_verification: "Verifikasi Email",
        password_reset: "Reset Password",
        login: "Login Akun"
    };

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
                .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
                .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>⚡ WattWise</h1>
                    <p>Smart Energy Monitoring</p>
                </div>
                <div class="content">
                    <h2>Kode OTP ${purposeText[purpose] || "Verifikasi"}</h2>
                    <p>Halo,</p>
                    <p>Berikut adalah kode OTP untuk ${purposeText[purpose] || "verifikasi"} akun Anda:</p>
                    
                    <div class="otp-box">
                        <div class="otp-code">${otpCode}</div>
                    </div>
                    
                    <div class="warning">
                        ⚠️ <strong>Penting:</strong>
                        <ul style="margin: 5px 0; padding-left: 20px;">
                            <li>Kode OTP berlaku selama <strong>5 menit</strong></li>
                            <li>Jangan bagikan kode ini kepada siapapun</li>
                            <li>Tim WattWise tidak akan pernah meminta kode OTP Anda</li>
                        </ul>
                    </div>
                    
                    <p>Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini.</p>
                    
                    <p>Salam,<br><strong>Tim WattWise</strong></p>
                </div>
                <div class="footer">
                    <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
                    <p>&copy; 2026 WattWise. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Kirim OTP via email
const sendOTPEmail = async (email, otpCode, purpose = "email_verification") => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"WattWise" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Kode OTP WattWise - ${otpCode}`,
            html: getOTPEmailTemplate(otpCode, purpose)
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("✅ Email OTP terkirim:", info.messageId);
        return {
            success: true,
            message: "Email OTP berhasil dikirim",
            messageId: info.messageId
        };
    } catch (error) {
        console.error("❌ Error mengirim email:", error);
        return {
            success: false,
            message: "Gagal mengirim email OTP",
            error: error.message
        };
    }
};

// Test koneksi email
const testEmailConnection = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log("✅ Email service siap digunakan");
        return true;
    } catch (error) {
        console.error("❌ Email service error:", error.message);
        return false;
    }
};

module.exports = {
    sendOTPEmail,
    testEmailConnection
};
