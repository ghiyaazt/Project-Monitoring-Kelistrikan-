const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },

        userId: {
            type: String,
            unique: true
        },

        namaLengkap: {
            type: String,
            required: [true, "Nama lengkap wajib diisi"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "Email wajib diisi"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Format email tidak valid"]
        },

        nomorTelepon: {
            type: String,
            required: [true, "Nomor telepon wajib diisi"],
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password wajib diisi"],
            minlength: [6, "Password minimal 6 karakter"],
            select: false // Tidak akan muncul saat query default
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        collection: "users",
        versionKey: false // Disable __v field
    }
);

// Auto-generate userId sebelum validate
userSchema.pre("validate", async function () {
    // Generate userId hanya untuk document baru
    if (this.isNew && !this.userId) {
        try {
            // Cari user terakhir berdasarkan userId
            const User = mongoose.model("User");
            const lastUser = await User.findOne({}, { userId: 1 })
                .sort({ userId: -1 })
                .limit(1)
                .lean();

            let nextId = 1;
            if (lastUser && lastUser.userId) {
                // Parse userId terakhir dan tambah 1
                const lastIdNum = parseInt(lastUser.userId);
                if (!isNaN(lastIdNum)) {
                    nextId = lastIdNum + 1;
                }
            }

            // Format jadi 4 digit dengan leading zeros
            this.userId = nextId.toString().padStart(4, "0");
            this._id = this.userId; // Set _id sama dengan userId
        } catch (error) {
            console.error("Error generating userId:", error);
            // Fallback: generate random 4 digit
            this.userId = Math.floor(1000 + Math.random() * 9000).toString();
            this._id = this.userId;
        }
    }
});

// Hash password sebelum save
userSchema.pre("save", async function () {
    // Hanya hash jika password dimodifikasi
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method untuk compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method untuk get user tanpa password
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model("User", userSchema);
