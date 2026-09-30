# 📧 Setup OTP dengan Gmail - WattWise

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install nodemailer
```

### 2. Setup Gmail App Password

#### Step 1: Enable 2-Factor Authentication
1. Buka [Google Account Security](https://myaccount.google.com/security)
2. Cari **"2-Step Verification"**
3. Klik **"Get Started"** dan ikuti instruksi
4. Aktifkan 2FA dengan nomor HP kamu

#### Step 2: Generate App Password
1. Setelah 2FA aktif, balik ke [Google Account Security](https://myaccount.google.com/security)
2. Cari **"App passwords"** (di bagian "How you sign in to Google")
3. Klik **"App passwords"**
4. Pilih:
   - **App:** Mail
   - **Device:** Other (Custom name)
   - Ketik: **"WattWise Backend"**
5. Klik **"Generate"**
6. **Copy password** yang muncul (16 karakter tanpa spasi)

### 3. Update .env File
```env
EMAIL_USER=emailkamu@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # Paste App Password di sini
```

**⚠️ PENTING:** Jangan push file `.env` ke GitHub!

### 4. Restart Server
```bash
npm run dev
```

---

## 📝 API Endpoints

### 1. Request OTP (Kirim OTP ke Email)
**POST** `/api/otp/request`

**Body:**
```json
{
  "email": "user@example.com",
  "purpose": "register"
}
```

**Purpose Options:**
- `register` - Untuk registrasi user baru
- `email_verification` - Untuk verifikasi email
- `password_reset` - Untuk reset password
- `login` - Untuk login dengan OTP

**Response Success:**
```json
{
  "success": true,
  "message": "Kode OTP berhasil dikirim ke email Anda",
  "data": {
    "email": "user@example.com",
    "expires_at": "2026-09-30T10:45:00.000Z",
    "purpose": "register"
  }
}
```

---

### 2. Verify OTP
**POST** `/api/otp/verify`

**Body:**
```json
{
  "email": "user@example.com",
  "otp_code": "123456",
  "purpose": "register"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Kode OTP berhasil diverifikasi",
  "data": {
    "email": "user@example.com",
    "purpose": "register",
    "verified_at": "2026-09-30T10:42:30.000Z"
  }
}
```

---

### 3. Resend OTP
**POST** `/api/otp/resend`

**Body:**
```json
{
  "email": "user@example.com",
  "purpose": "register"
}
```

---

### 4. Check OTP Status
**GET** `/api/otp/status/:email/:purpose`

**Example:**
```
GET /api/otp/status/user@example.com/register
```

**Response:**
```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "purpose": "register",
    "is_verified": true
  }
}
```

---

## 🧪 Testing

### Test dengan Postman/Thunder Client:

1. **Request OTP**
   ```
   POST http://localhost:5000/api/otp/request
   Body: {
     "email": "emailkamu@gmail.com",
     "purpose": "register"
   }
   ```

2. **Cek email kamu** - harusnya dapat email dengan kode OTP 6 digit

3. **Verify OTP**
   ```
   POST http://localhost:5000/api/otp/verify
   Body: {
     "email": "emailkamu@gmail.com",
     "otp_code": "123456",
     "purpose": "register"
   }
   ```

---

## ⚙️ Configuration

### OTP Settings (bisa diubah di model OTP.js):
- **OTP Length:** 6 digit
- **Expiry Time:** 5 menit
- **Max Attempts:** 3 kali percobaan
- **Rate Limit:** 1 OTP per menit per email
- **Auto Delete:** OTP otomatis terhapus setelah expired

---

## 🔒 Security Features

✅ **Rate Limiting** - Maksimal 1 OTP per menit  
✅ **Max Attempts** - Maksimal 3 kali salah input  
✅ **Auto Expire** - OTP otomatis expired setelah 5 menit  
✅ **Auto Delete** - OTP otomatis terhapus dari database setelah expired  
✅ **One-time Use** - OTP hanya bisa dipakai sekali  
✅ **Purpose Specific** - Setiap OTP punya tujuan spesifik  

---

## 🐛 Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"
**Solusi:**
1. Pastikan 2FA sudah aktif di Google Account
2. Generate ulang App Password
3. Copy paste App Password dengan benar (16 karakter)
4. Hapus spasi di App Password

### Error: "Gagal mengirim email OTP"
**Solusi:**
1. Cek koneksi internet
2. Pastikan EMAIL_USER dan EMAIL_PASS sudah benar di .env
3. Restart server setelah update .env
4. Test email connection dengan command:
   ```javascript
   const { testEmailConnection } = require('./src/services/emailService');
   testEmailConnection();
   ```

### OTP tidak masuk ke email
**Solusi:**
1. Cek folder **Spam/Junk**
2. Tunggu 1-2 menit (kadang delay)
3. Cek log server untuk error message

---

## 📊 Database Schema

### Collection: `otps`
```javascript
{
  _id: ObjectId("..."),
  user_id: ObjectId("..."),        // Optional
  email: "user@example.com",
  otp_code: "123456",
  purpose: "register",
  is_verified: false,
  attempts: 0,
  max_attempts: 3,
  expires_at: ISODate("2026-09-30T10:45:00.000Z"),
  createdAt: ISODate("2026-09-30T10:40:00.000Z"),
  updatedAt: ISODate("2026-09-30T10:40:00.000Z")
}
```

---

## 🎨 Email Template

Email yang dikirim menggunakan template HTML yang cantik dengan:
- Header gradient ungu (brand WattWise)
- OTP box besar dengan font 32px
- Warning box untuk keamanan
- Responsive design
- Professional footer

---

## 📚 Integration Example

### Register dengan OTP:
```javascript
// 1. User klik "Register"
// 2. Request OTP
POST /api/otp/request
{
  "email": "user@example.com",
  "purpose": "register"
}

// 3. User input OTP dari email
// 4. Verify OTP
POST /api/otp/verify
{
  "email": "user@example.com",
  "otp_code": "123456",
  "purpose": "register"
}

// 5. Kalau OTP valid, lanjut register
POST /api/auth/register
{
  "nama": "Test User",
  "email": "user@example.com",
  "no_telp": "08123456789",
  "password": "password123",
  "konfirmasiPassword": "password123"
}
```

---

## 📞 Support

Kalau ada masalah atau butuh bantuan, silakan buka issue atau hubungi tim dev! 🚀

**Happy Coding! ⚡**
