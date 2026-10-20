const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },

        id_user: {
            type: String,
            unique: true
        },

        nama: {
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

        no_telp: {
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
            enum: {
                values: ["owner", "penghuni", "admin"],
                message: "Role harus owner, penghuni, atau admin"
            },
            default: "penghuni"
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

// Auto-generate id_user sebelum validate
userSchema.pre("validate", async function () {
    // Generate id_user hanya untuk document baru
    if (this.isNew && !this.id_user) {
        try {
            // Cari user terakhir berdasarkan id_user
            const User = mongoose.model("User");
            const lastUser = await User.findOne({}, { id_user: 1 })
                .sort({ id_user: -1 })
                .limit(1)
                .lean();

            let nextId = 1;
            if (lastUser && lastUser.id_user) {
                // Parse id_user terakhir dan tambah 1
                const lastIdNum = parseInt(lastUser.id_user);
                if (!isNaN(lastIdNum)) {
                    nextId = lastIdNum + 1;
                }
            }

            // Format jadi 4 digit dengan leading zeros
            this.id_user = nextId.toString().padStart(4, "0");
            // JANGAN set _id, biar MongoDB yang auto-generate pakai ObjectId
        } catch (error) {
            console.error("Error generating id_user:", error);
            // Fallback: generate random 4 digit
            this.id_user = Math.floor(1000 + Math.random() * 9000).toString();
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
