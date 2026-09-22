const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware untuk protect routes
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Akses ditolak. Silakan login terlebih dahulu"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "wattwise-secret-key-2025");

        // Get user from token
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Akun Anda tidak aktif"
            });
        }

        // Add user to request
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Token tidak valid"
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token sudah kadaluarsa. Silakan login kembali"
            });
        }

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

// Middleware untuk authorize based on role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role ${req.user.role} tidak memiliki akses ke endpoint ini`
            });
        }
        next();
    };
};
