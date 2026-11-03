# 🔌 Backend Integration Guide - WattWise Web2

Panduan lengkap untuk menjalankan dan testing integrasi backend dengan frontend WattWise Web2.

## 📋 Daftar Isi
- [Persiapan](#persiapan)
- [Menjalankan Backend](#menjalankan-backend)
- [Menjalankan Frontend](#menjalankan-frontend)
- [Testing Fitur Login](#testing-fitur-login)
- [Testing Fitur Register](#testing-fitur-register)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Persiapan

### 1. Backend Setup

Pastikan backend sudah terinstall dan dikonfigurasi dengan benar:

```bash
cd backend
npm install
```

### 2. Konfigurasi Environment Backend

Pastikan file `.env` di folder backend sudah dikonfigurasi:

```env
# Backend .env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wattwise
JWT_SECRET=wattwise-secret-key-2025
JWT_EXPIRE=7d
```

### 3. Frontend Setup

Pastikan frontend sudah terinstall:

```bash
cd web2/wattwise
npm install
```

### 4. Konfigurasi Environment Frontend

File `.env` di folder frontend sudah dikonfigurasi pointing ke backend lokal:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎯 Menjalankan Backend

### 1. Start MongoDB
Pastikan MongoDB sudah running di lokal:

```bash
# Windows (jika menggunakan MongoDB service)
net start MongoDB

# Atau jalankan mongod manual
mongod --dbpath "path/to/your/data"
```

### 2. Start Backend Server

```bash
cd backend
npm start
```

Backend akan running di: **http://localhost:5000**

Cek apakah backend sudah running dengan buka browser:
```
http://localhost:5000/api/
```

Seharusnya muncul response dari API.

---

## 💻 Menjalankan Frontend

Buka terminal baru dan jalankan:

```bash
cd web2/wattwise
npm start
```

Frontend akan running di: **http://localhost:3000**

Browser akan otomatis terbuka ke landing page WattWise.

---

## 🔐 Testing Fitur Login

### 1. Akses Halaman Login

- Klik tombol **"Masuk"** di landing page
- Atau langsung navigasi ke halaman login

### 2. Login dengan Akun Test

**Cara 1: Menggunakan Akun yang Sudah Ada**

Jika sudah pernah registrasi sebelumnya, gunakan credentials yang sama:

```
Email: test@example.com
Password: test123
```

**Cara 2: Buat Akun Baru Dulu (lihat Testing Register)**

### 3. Testing Flow Login

#### ✅ Test Case 1: Login Berhasil
1. Masukkan email dan password yang valid
2. Klik tombol **"Masuk"**
3. **Expected Result**: 
   - Loading indicator muncul
   - Redirect ke dashboard
   - User data tersimpan di localStorage
   - Token JWT tersimpan

#### ❌ Test Case 2: Login dengan Email Salah
1. Masukkan email: `salah@example.com`
2. Masukkan password: `apasaja123`
3. Klik **"Masuk"**
4. **Expected Result**: 
   - Error message: "Email atau password salah"
   - Tetap di halaman login

#### ❌ Test Case 3: Login dengan Password Salah
1. Masukkan email yang valid
2. Masukkan password yang salah
3. Klik **"Masuk"**
4. **Expected Result**: 
   - Error message: "Email atau password salah"
   - Tetap di halaman login

#### ❌ Test Case 4: Login dengan Field Kosong
1. Biarkan email atau password kosong
2. Klik **"Masuk"**
3. **Expected Result**: 
   - Error message: "Email dan password wajib diisi"
   - Form tidak submit

#### 🔌 Test Case 5: Login saat Backend Mati
1. Stop backend server (Ctrl+C di terminal backend)
2. Coba login
3. **Expected Result**: 
   - Error message: "Server tidak merespon. Pastikan backend sudah running."

### 4. Cek Token di Browser DevTools

Setelah login berhasil, buka **Browser DevTools** (F12):

```javascript
// Console
localStorage.getItem('token')
// Output: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

localStorage.getItem('user')
// Output: "{\"id\":\"...\",\"nama\":\"...\",\"email\":\"...\"}"
```

---

## 📝 Testing Fitur Register

### 1. Akses Halaman Register

- Dari landing page, klik **"Daftar"**
- Atau dari halaman login, klik link **"Daftar"**

### 2. Testing Flow Register

#### ✅ Test Case 1: Register Berhasil
1. Isi form dengan data valid:
   ```
   Nama Lengkap: John Doe
   Email: john.doe@example.com
   Nomor Telepon: 08123456789
   Role: Owner/Pemilik Kos
   Password: Password123!
   Konfirmasi Password: Password123!
   ```
2. Klik **"Daftar Sekarang"**
3. **Expected Result**: 
   - Loading indicator muncul
   - Account created successfully
   - Auto login dan redirect ke dashboard
   - Token dan user data tersimpan

#### ❌ Test Case 2: Register dengan Email yang Sudah Terdaftar
1. Gunakan email yang sudah pernah dipakai registrasi
2. Isi field lainnya dengan valid
3. Klik **"Daftar Sekarang"**
4. **Expected Result**: 
   - Error message: "Email sudah terdaftar"
   - Tetap di halaman register

#### ❌ Test Case 3: Register dengan Password Tidak Match
1. Isi semua field dengan benar
2. Password: `Password123!`
3. Konfirmasi Password: `Password456!`
4. Klik **"Daftar Sekarang"**
5. **Expected Result**: 
   - Error message: "Password dan konfirmasi password tidak cocok"

#### ❌ Test Case 4: Register dengan Password Lemah
1. Gunakan password: `123`
2. **Expected Result**: 
   - Password strength indicator merah
   - Error message tentang requirements password

#### ❌ Test Case 5: Register dengan Field Kosong
1. Biarkan ada field yang kosong
2. Klik **"Daftar Sekarang"**
3. **Expected Result**: 
   - Error message: "Semua field wajib diisi"

### 3. Testing Role Selection

Test registrasi dengan berbagai role:

**Owner/Pemilik Kos:**
```
Role: owner
Expected: User terdaftar sebagai owner
```

**Penghuni:**
```
Role: penghuni
Expected: User terdaftar sebagai penghuni (default)
```

**Admin:**
```
Role: admin
Expected: User terdaftar sebagai admin
```

---

## 🔍 Monitoring API Calls

### 1. Browser DevTools Network Tab

Buka DevTools (F12) → Tab **Network**:

**Login Request:**
```
Method: POST
URL: http://localhost:5000/api/auth/login
Request Body:
{
  "email": "test@example.com",
  "password": "test123"
}

Response (Success):
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "...",
      "nama": "Test User",
      "email": "test@example.com",
      "no_telp": "08123456789",
      "role": "owner"
    },
    "token": "eyJhbGci..."
  }
}
```

**Register Request:**
```
Method: POST
URL: http://localhost:5000/api/auth/register
Request Body:
{
  "nama": "John Doe",
  "email": "john@example.com",
  "no_telp": "08123456789",
  "password": "Password123!",
  "konfirmasiPassword": "Password123!",
  "role": "owner"
}

Response (Success):
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": { ... },
    "token": "eyJhbGci..."
  }
}
```

### 2. Backend Console Logs

Di terminal backend, akan muncul logs:

```
POST /api/auth/login 200 - 245ms
POST /api/auth/register 201 - 389ms
GET /api/auth/me 200 - 12ms
```

---

## 🛠️ Troubleshooting

### ❌ Problem: "Server tidak merespon"

**Solusi:**
1. Pastikan backend sudah running: `http://localhost:5000`
2. Cek MongoDB sudah running
3. Cek port 5000 tidak digunakan app lain
4. Restart backend server

### ❌ Problem: CORS Error

**Solusi:**
Backend sudah dikonfigurasi dengan CORS. Jika masih error:

```javascript
// backend/src/app.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### ❌ Problem: "Email sudah terdaftar" saat testing

**Solusi:**
1. Gunakan email berbeda setiap kali test register
2. Atau hapus user dari database MongoDB:

```bash
# MongoDB shell
use wattwise
db.users.deleteOne({ email: "test@example.com" })
```

### ❌ Problem: Token tidak tersimpan

**Solusi:**
1. Cek browser localStorage (DevTools → Application → Local Storage)
2. Clear localStorage dan coba lagi:
```javascript
localStorage.clear()
```

### ❌ Problem: Redirect tidak berfungsi setelah login

**Solusi:**
1. Cek context AppContext sudah properly set user
2. Cek console untuk error
3. Refresh halaman

---

## 📦 File Structure Implementasi

```
web2/wattwise/
├── src/
│   ├── services/
│   │   ├── apiClient.ts         # ✅ Axios config + interceptors
│   │   └── authService.ts       # ✅ Login & Register API calls
│   ├── features/auth/components/
│   │   ├── Login/
│   │   │   └── Login.tsx        # ✅ Updated dengan backend integration
│   │   └── Register/
│   │       └── Register.tsx     # ✅ Updated dengan backend integration
│   └── app/
│       └── App.tsx              # ✅ Updated routing
└── .env                         # ✅ API URL configuration
```

---

## 🎓 Next Steps

Setelah login/register berhasil, implementasi selanjutnya:

1. **Protected Routes** - Middleware untuk protect dashboard pages
2. **Auto Logout** - Handle token expiration
3. **Profile Management** - Update user profile
4. **Forgot Password Flow** - Connect ke backend OTP
5. **Role-Based Access Control** - Different UI based on role

---

## 📞 Support

Jika ada masalah:
1. Cek console browser (F12)
2. Cek terminal backend untuk error logs
3. Cek MongoDB connection
4. Pastikan semua dependencies terinstall

---

**Happy Coding! 🚀⚡**

*WattWise - Smart Energy Monitoring System*
