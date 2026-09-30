const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false // Optional, karena bisa juga untuk user yang belum register
        },

        email: {
            type: String,
            required: [true, "Email wajib diisi"],
            lowercase: true,
            trim: true
        },

        otp_code: {
            type: String,
            required: [true, "Kode OTP wajib diisi"],
            length: 6
        },

        purpose: {
            type: String,
            enum: ["email_verification", "password_reset", "login", "register"],
            required: [true, "Purpose OTP wajib diisi"]
        },

        is_verified: {
            type: Boolean,
            default: false
        },

        attempts: {
            type: Number,
            default: 0
        },

        max_attempts: {
            type: Number,
            default: 3
        },

        expires_at: {
            type: Date,
            required: true,
            index: { expires: 0 } // TTL index - auto delete setelah expires_at
        }
    },
    {
        timestamps: true,
        collection: "otps",
        versionKey: false
    }
);

// Index untuk query cepat
otpSchema.index({ email: 1, purpose: 1 });
otpSchema.index({ user_id: 1 });

// Method untuk generate OTP code (6 digit)
otpSchema.statics.generateCode = function () {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Method untuk create OTP baru
otpSchema.statics.createOTP = async function (email, purpose, userId = null) {
    // Hapus OTP lama yang belum diverifikasi untuk email & purpose yang sama
    await this.deleteMany({ email, purpose, is_verified: false });

    // Generate OTP code
    const otpCode = this.generateCode();

    // Set expiry 5 menit dari sekarang
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Create OTP baru
    const otp = await this.create({
        user_id: userId,
        email,
        otp_code: otpCode,
        purpose,
        expires_at: expiresAt
    });

    return otp;
};

// Method untuk verify OTP
otpSchema.statics.verifyOTP = async function (email, otpCode, purpose) {
    const otp = await this.findOne({
        email,
        otp_code: otpCode,
        purpose,
        is_verified: false,
        expires_at: { $gt: new Date() } // Belum expired
    });

    if (!otp) {
        return {
            success: false,
            message: "Kode OTP tidak valid atau sudah kadaluarsa"
        };
    }

    // Check max attempts
    if (otp.attempts >= otp.max_attempts) {
        await otp.deleteOne();
        return {
            success: false,
            message: "Terlalu banyak percobaan. Silakan minta OTP baru"
        };
    }

    // Increment attempts
    otp.attempts += 1;
    await otp.save();

    // Verify berhasil
    otp.is_verified = true;
    await otp.save();

    return {
        success: true,
        message: "Kode OTP berhasil diverifikasi",
        otp
    };
};

// Method untuk check apakah OTP sudah diverifikasi
otpSchema.statics.isVerified = async function (email, purpose) {
    const otp = await this.findOne({
        email,
        purpose,
        is_verified: true,
        expires_at: { $gt: new Date() }
    });

    return !!otp;
};

module.exports = mongoose.model("OTP", otpSchema);
