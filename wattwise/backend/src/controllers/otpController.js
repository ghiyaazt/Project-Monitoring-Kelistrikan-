const OTP = require("../models/OTP");
const User = require("../models/User");
const { sendOTPEmail } = require("../services/emailService");

// @desc    Request OTP (kirim OTP ke email)
// @route   POST /api/otp/request
// @access  Public
exports.requestOTP = async (req, res) => {
    try {
        const { email, purpose } = req.body;

        // Validasi input
        if (!email || !purpose) {
            return res.status(400).json({
                success: false,
                message: "Email dan purpose wajib diisi"
            });
        }

        // Validasi purpose
        const validPurposes = ["register", "email_verification", "password_reset", "login"];
        if (!validPurposes.includes(purpose)) {
            return res.status(400).json({
                success: false,
                message: "Purpose tidak valid"
            });
        }

        // Check rate limiting - maksimal 1 OTP per menit per email
        const recentOTP = await OTP.findOne({
            email,
            purpose,
            createdAt: { $gt: new Date(Date.now() - 60 * 1000) } // 1 menit terakhir
        });

        if (recentOTP) {
            return res.status(429).json({
                success: false,
                message: "Mohon tunggu 1 menit sebelum meminta OTP baru"
            });
        }

        // Cek apakah user ada (untuk purpose selain register)
        let userId = null;
        if (purpose !== "register") {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Email tidak terdaftar"
                });
            }
            userId = user._id;
        }

        // Create OTP baru
        const otp = await OTP.createOTP(email, purpose, userId);

        // Kirim OTP via email
        const emailResult = await sendOTPEmail(email, otp.otp_code, purpose);

        if (!emailResult.success) {
            return res.status(500).json({
                success: false,
                message: "Gagal mengirim email OTP",
                error: emailResult.error
            });
        }

        res.status(200).json({
            success: true,
            message: "Kode OTP berhasil dikirim ke email Anda",
            data: {
                email: otp.email,
                expires_at: otp.expires_at,
                purpose: otp.purpose
            }
        });
    } catch (error) {
        console.error("Request OTP error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat memproses permintaan OTP",
            error: error.message
        });
    }
};

// @desc    Verify OTP
// @route   POST /api/otp/verify
// @access  Public
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp_code, purpose } = req.body;

        // Validasi input
        if (!email || !otp_code || !purpose) {
            return res.status(400).json({
                success: false,
                message: "Email, kode OTP, dan purpose wajib diisi"
            });
        }

        // Verify OTP
        const result = await OTP.verifyOTP(email, otp_code, purpose);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        res.status(200).json({
            success: true,
            message: "Kode OTP berhasil diverifikasi",
            data: {
                email: result.otp.email,
                purpose: result.otp.purpose,
                verified_at: new Date()
            }
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat memverifikasi OTP",
            error: error.message
        });
    }
};

// @desc    Resend OTP
// @route   POST /api/otp/resend
// @access  Public
exports.resendOTP = async (req, res) => {
    try {
        const { email, purpose } = req.body;

        // Validasi input
        if (!email || !purpose) {
            return res.status(400).json({
                success: false,
                message: "Email dan purpose wajib diisi"
            });
        }

        // Hapus OTP lama
        await OTP.deleteMany({ email, purpose, is_verified: false });

        // Redirect ke requestOTP
        req.body = { email, purpose };
        return exports.requestOTP(req, res);
    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengirim ulang OTP",
            error: error.message
        });
    }
};

// @desc    Check OTP status
// @route   GET /api/otp/status/:email/:purpose
// @access  Public
exports.checkOTPStatus = async (req, res) => {
    try {
        const { email, purpose } = req.params;

        const isVerified = await OTP.isVerified(email, purpose);

        res.status(200).json({
            success: true,
            data: {
                email,
                purpose,
                is_verified: isVerified
            }
        });
    } catch (error) {
        console.error("Check OTP status error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengecek status OTP",
            error: error.message
        });
    }
};
