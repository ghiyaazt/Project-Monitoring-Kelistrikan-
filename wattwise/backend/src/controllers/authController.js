const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || "wattwise-secret-key-2025", {
        expiresIn: process.env.JWT_EXPIRE || "7d"
    });
};

// @desc    Register user baru
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { namaLengkap, email, nomorTelepon, password, konfirmasiPassword } = req.body;

        // Validasi input
        if (!namaLengkap || !email || !nomorTelepon || !password || !konfirmasiPassword) {
            return res.status(400).json({
                success: false,
                message: "Semua field wajib diisi"
            });
        }

        // Check password match
        if (password !== konfirmasiPassword) {
            return res.status(400).json({
                success: false,
                message: "Password dan konfirmasi password tidak cocok"
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email sudah terdaftar"
            });
        }

        // Create user
        const user = await User.create({
            namaLengkap,
            email,
            nomorTelepon,
            password
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "Registrasi berhasil",
            data: {
                user: {
                    id: user.userId || user._id,
                    namaLengkap: user.namaLengkap,
                    email: user.email,
                    nomorTelepon: user.nomorTelepon,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error("Register error:", error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email sudah terdaftar"
            });
        }

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat registrasi",
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email dan password wajib diisi"
            });
        }

        // Check user exists (include password field)
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah"
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Akun Anda tidak aktif"
            });
        }

        // Verify password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah"
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login berhasil",
            data: {
                user: {
                    id: user.userId || user._id,
                    namaLengkap: user.namaLengkap,
                    email: user.email,
                    nomorTelepon: user.nomorTelepon,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat login",
            error: error.message
        });
    }
};

// @desc    Get user profile (protected route)
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data profil",
            error: error.message
        });
    }
};
