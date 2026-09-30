# 📚 WattWise API Documentation

## Base URL
```
http://localhost:5000
```

---

## 🔐 Authentication APIs

### 1. Register User
**POST** `/api/auth/register`

**Body:**
```json
{
  "nama": "Test User",
  "email": "test@example.com",
  "no_telp": "08123456789",
  "password": "password123",
  "konfirmasiPassword": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": "0001",
      "nama": "Test User",
      "email": "test@example.com",
      "no_telp": "08123456789",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login User
**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "0001",
      "nama": "Test User",
      "email": "test@example.com",
      "no_telp": "08123456789",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Get My Profile (Protected)
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "id_user": "0001",
    "nama": "Test User",
    "email": "test@example.com",
    "no_telp": "08123456789",
    "role": "user",
    "isActive": true,
    "createdAt": "2026-09-30T10:00:00.000Z",
    "updatedAt": "2026-09-30T10:00:00.000Z"
  }
}
```

---

## 📧 OTP APIs

### 1. Request OTP
**POST** `/api/otp/request`

**Body:**
```json
{
  "email": "test@example.com",
  "purpose": "register"
}
```

**Purpose Options:**
- `register` - Registrasi
- `email_verification` - Verifikasi email
- `password_reset` - Reset password
- `login` - Login dengan OTP

**Response:**
```json
{
  "success": true,
  "message": "Kode OTP berhasil dikirim ke email Anda",
  "data": {
    "email": "test@example.com",
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
  "email": "test@example.com",
  "otp_code": "123456",
  "purpose": "register"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kode OTP berhasil diverifikasi",
  "data": {
    "email": "test@example.com",
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
  "email": "test@example.com",
  "purpose": "register"
}
```

---

### 4. Check OTP Status
**GET** `/api/otp/status/:email/:purpose`

**Example:**
```
GET /api/otp/status/test@example.com/register
```

**Response:**
```json
{
  "success": true,
  "data": {
    "email": "test@example.com",
    "purpose": "register",
    "is_verified": true
  }
}
```

---

## 📊 Sensor Data APIs

### 1. Get Latest Sensor Data
**GET** `/api/sensor/latest`

**Response:**
```json
{
  "success": true,
  "data": {
    "voltage": 220.5,
    "current": 2.3,
    "power": 506.15,
    "energy": 1.25,
    "frequency": 50,
    "powerFactor": 0.98,
    "timestamp": "2026-09-30T10:00:00.000Z"
  }
}
```

---

### 2. Get Sensor Data History
**GET** `/api/sensor/history?limit=100&page=1`

**Query Parameters:**
- `limit` (optional) - Jumlah data per halaman (default: 100)
- `page` (optional) - Halaman ke- (default: 1)
- `startDate` (optional) - Filter dari tanggal (ISO format)
- `endDate` (optional) - Filter sampai tanggal (ISO format)

**Example:**
```
GET /api/sensor/history?limit=50&page=1&startDate=2026-09-01&endDate=2026-09-30
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "voltage": 220.5,
      "current": 2.3,
      "power": 506.15,
      "energy": 1.25,
      "frequency": 50,
      "powerFactor": 0.98,
      "timestamp": "2026-09-30T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1000,
    "page": 1,
    "limit": 50,
    "totalPages": 20
  }
}
```

---

## 🧪 Testing APIs

### Menggunakan Postman:

1. **Import Collection:**
   - Buat collection baru "WattWise API"
   - Tambahkan semua endpoint di atas

2. **Set Base URL:**
   - Create variable: `{{base_url}}` = `http://localhost:5000`

3. **Save Token:**
   - Setelah login, copy token
   - Simpan di variable: `{{token}}`
   - Untuk protected route, tambah header:
     ```
     Authorization: Bearer {{token}}
     ```

### Menggunakan Thunder Client (VS Code Extension):

1. Install extension "Thunder Client"
2. Buat New Request
3. Pilih method (GET/POST)
4. Masukkan URL
5. Untuk POST, pilih tab "Body" → "JSON"
6. Untuk protected route, tab "Headers" → tambah:
   ```
   Key: Authorization
   Value: Bearer <your-token>
   ```

### Menggunakan cURL:

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Test User",
    "email": "test@example.com",
    "no_telp": "08123456789",
    "password": "password123",
    "konfirmasiPassword": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Profile (Protected):**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Error Responses

### Format Error:
```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (only in development)"
}
```

### Common Error Codes:
- `400` - Bad Request (data tidak valid)
- `401` - Unauthorized (token tidak valid/expired)
- `404` - Not Found (data tidak ditemukan)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## 🔑 Authentication Flow

### 1. Register dengan OTP:
```
1. POST /api/otp/request (purpose: "register")
2. User cek email dan dapat OTP
3. POST /api/otp/verify (verifikasi OTP)
4. POST /api/auth/register (register user)
5. Simpan token dari response
```

### 2. Login biasa:
```
1. POST /api/auth/login
2. Simpan token dari response
3. Gunakan token untuk request berikutnya
```

### 3. Login dengan OTP:
```
1. POST /api/otp/request (purpose: "login")
2. User cek email dan dapat OTP
3. POST /api/otp/verify (verifikasi OTP)
4. POST /api/auth/login (login user)
5. Simpan token dari response
```

---

## 🛡️ Security Notes

1. **Jangan simpan password di plain text** - sudah otomatis di-hash dengan bcrypt
2. **Token JWT expires** dalam 7 hari (configurable di .env)
3. **OTP expires** dalam 5 menit
4. **Rate limiting** untuk OTP: 1 request per menit per email
5. **Max OTP attempts:** 3 kali salah input

---

## 📍 Server Status

### Check if server is running:
**GET** `/`

**Response:**
```json
{
  "message": "WattWise Backend is running!"
}
```

---

## 🔧 Environment Variables

File: `.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 📞 Need Help?

Kalau ada endpoint yang belum jelas atau butuh custom endpoint baru, tinggal bilang aja! 🚀
