# WattWise Authentication API Documentation

## Base URL
```
http://localhost:5000/api/auth
```

---

## Endpoints

### 1. Register User Baru

**Endpoint:** `POST /api/auth/register`

**Deskripsi:** Mendaftarkan user baru ke sistem

**Request Body:**
```json
{
  "namaLengkap": "John Doe",
  "email": "john@example.com",
  "nomorTelepon": "08123456789",
  "password": "password123",
  "konfirmasiPassword": "password123"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": "673a1b2c3d4e5f6a7b8c9d0e",
      "namaLengkap": "John Doe",
      "email": "john@example.com",
      "nomorTelepon": "08123456789",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Deskripsi:** Login user yang sudah terdaftar

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "673a1b2c3d4e5f6a7b8c9d0e",
      "namaLengkap": "John Doe",
      "email": "john@example.com",
      "nomorTelepon": "08123456789",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

---

### 3. Get User Profile (Protected)

**Endpoint:** `GET /api/auth/me`

**Deskripsi:** Mendapatkan informasi profil user yang sedang login

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "673a1b2c3d4e5f6a7b8c9d0e",
    "namaLengkap": "John Doe",
    "email": "john@example.com",
    "nomorTelepon": "08123456789",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Akses ditolak. Silakan login terlebih dahulu"
}
```

---

## Testing dengan Postman/Thunder Client

### 1. Register
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "namaLengkap": "Test User",
  "email": "test@example.com",
  "nomorTelepon": "08123456789",
  "password": "test123",
  "konfirmasiPassword": "test123"
}
```

### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}
```

### 3. Get Profile (gunakan token dari response login)
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Database Schema

**Collection:** `users`

**Fields:**
- `namaLengkap` (String, required) - Nama lengkap user
- `email` (String, required, unique) - Email user
- `nomorTelepon` (String, required) - Nomor telepon user
- `password` (String, required) - Password yang sudah di-hash
- `role` (String, enum: ['user', 'admin']) - Role user, default 'user'
- `isActive` (Boolean) - Status aktif user, default true
- `createdAt` (Date) - Tanggal dibuat (auto)
- `updatedAt` (Date) - Tanggal diupdate (auto)

---

## Error Codes

- **200** - Success
- **201** - Created (untuk register)
- **400** - Bad Request (validasi error)
- **401** - Unauthorized (login gagal / token invalid)
- **403** - Forbidden (tidak punya akses)
- **500** - Internal Server Error

---

## Cara Menggunakan Token JWT

Setelah login/register, simpan token yang diterima di response.
Gunakan token tersebut di header `Authorization` dengan format:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

Token berlaku selama 7 hari (sesuai JWT_EXPIRE di .env).

---

## Security Notes

⚠️ **PENTING untuk Production:**
1. Ganti `JWT_SECRET` di `.env` dengan string yang lebih random dan secure
2. Gunakan HTTPS untuk production
3. Implementasi rate limiting untuk prevent brute force
4. Tambahkan email verification jika perlu
5. Implementasi refresh token untuk security lebih baik
