# 🧪 Quick Test Guide - Login & Register

Panduan cepat untuk test fitur login dan register.

## 🚀 Quick Start (5 Menit)

### Step 1: Jalankan Backend
```bash
cd backend
npm start
```
✅ Backend running di: http://localhost:5000

### Step 2: Jalankan Frontend
```bash
cd web2/wattwise
npm start
```
✅ Frontend running di: http://localhost:3000

### Step 3: Test!

---

## 🔐 Test Login

### Skenario 1: Login Berhasil

1. **Buka:** http://localhost:3000
2. **Klik:** "Masuk" di landing page
3. **Isi form:**
   - Email: `test@example.com`
   - Password: `test123`
4. **Klik:** "Masuk"
5. **✅ Expected:** Redirect ke dashboard

> **Note:** Pastikan akun sudah terdaftar! Kalau belum, register dulu.

### Skenario 2: Login Gagal - Email Salah

1. **Isi form:**
   - Email: `salah@email.com`
   - Password: `apasaja`
2. **Klik:** "Masuk"
3. **❌ Expected:** Error "Email atau password salah"

### Skenario 3: Login Gagal - Field Kosong

1. **Biarkan email/password kosong**
2. **Klik:** "Masuk"
3. **❌ Expected:** Error "Email dan password wajib diisi"

---

## 📝 Test Register

### Skenario 1: Register Berhasil

1. **Dari login page, klik:** "Daftar"
2. **Isi form:**
   - Nama: `Test User`
   - Email: `testuser@example.com` (email baru!)
   - No Telp: `08123456789`
   - Role: `Owner/Pemilik Kos`
   - Password: `Test123!`
   - Konfirm: `Test123!`
3. **Klik:** "Daftar Sekarang"
4. **✅ Expected:** Auto login + redirect ke dashboard

### Skenario 2: Register Gagal - Email Sudah Ada

1. **Gunakan email yang sudah pernah didaftarkan**
2. **Isi field lain dengan benar**
3. **Klik:** "Daftar Sekarang"
4. **❌ Expected:** Error "Email sudah terdaftar"

### Skenario 3: Register Gagal - Password Tidak Match

1. **Isi semua field**
2. **Password:** `Test123!`
3. **Konfirmasi:** `Test456!` (beda!)
4. **❌ Expected:** Error "Password dan konfirmasi password tidak cocok"

---

## 🔍 Cek Hasil di Browser DevTools

### Setelah Login/Register Berhasil:

1. **Tekan F12** (buka DevTools)
2. **Tab Console**, ketik:

```javascript
// Cek token
localStorage.getItem('token')
// Output: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Cek user data
JSON.parse(localStorage.getItem('user'))
// Output: { name: "Test User", email: "...", ... }
```

3. **Tab Network**, cek API calls:
   - `POST /api/auth/login` → Status 200
   - `POST /api/auth/register` → Status 201

---

## 🎯 Test Matrix

| Test Case | Email | Password | Role | Expected Result |
|-----------|-------|----------|------|-----------------|
| Login Valid | `test@example.com` | `test123` | - | ✅ Success → Dashboard |
| Login Invalid Email | `wrong@email.com` | `test123` | - | ❌ Error message |
| Login Invalid Password | `test@example.com` | `wrongpass` | - | ❌ Error message |
| Login Empty Fields | `` | `` | - | ❌ Error message |
| Register New User | `new@example.com` | `Pass123!` | Owner | ✅ Success → Dashboard |
| Register Existing Email | `test@example.com` | `Pass123!` | Owner | ❌ Error message |
| Register Password Mismatch | `new2@example.com` | `Pass/Pass2` | Owner | ❌ Error message |
| Register Weak Password | `new3@example.com` | `123` | Owner | ❌ Error message |

---

## 🛠️ Troubleshooting Cepat

### ❌ "Server tidak merespon"
**Fix:** 
```bash
# Cek backend running
curl http://localhost:5000/api/
```

### ❌ "Email sudah terdaftar" (saat testing)
**Fix:** Gunakan email berbeda atau hapus dari DB:
```javascript
// MongoDB shell
db.users.deleteOne({ email: "test@example.com" })
```

### ❌ Frontend tidak update setelah edit code
**Fix:**
```bash
# Clear cache dan restart
npm run clear-cache
npm start
```

### ❌ CORS Error
**Fix:** Pastikan backend punya CORS config:
```javascript
app.use(cors({ origin: 'http://localhost:3000' }));
```

---

## 📸 Screenshot Test Points

### 1. Landing Page
- [ ] Button "Masuk" visible
- [ ] Button "Daftar" visible

### 2. Login Page
- [ ] Form email visible
- [ ] Form password visible
- [ ] Button "Masuk" visible
- [ ] Link "Daftar" visible
- [ ] Link "Lupa password" visible

### 3. Register Page
- [ ] Form nama visible
- [ ] Form email visible
- [ ] Form nomor telepon visible
- [ ] Dropdown role visible (Owner, Penghuni, Admin)
- [ ] Form password visible
- [ ] Form konfirmasi password visible
- [ ] Password strength indicator visible
- [ ] Button "Daftar Sekarang" visible
- [ ] Link "Masuk" visible

### 4. After Login Success
- [ ] Redirected to dashboard
- [ ] User name displayed in sidebar/header
- [ ] Token in localStorage
- [ ] User data in localStorage

---

## 🎉 Success Indicators

✅ **Login/Register berhasil jika:**
1. Tidak ada error message
2. Loading indicator muncul sebentar
3. Redirect ke dashboard
4. Token tersimpan di localStorage
5. User name muncul di UI
6. Bisa akses protected pages

---

## 📝 Test Credentials

### Pre-registered Test Accounts:
```
Owner Account:
Email: owner@wattwise.com
Password: Owner123!

Penghuni Account:
Email: penghuni@wattwise.com
Password: Penghuni123!

Admin Account:
Email: admin@wattwise.com
Password: Admin123!
```

> **Note:** Buat accounts ini dulu via register atau MongoDB insert jika belum ada.

---

## 🔄 Reset Test Environment

Jika ingin reset semua data test:

```bash
# 1. Clear frontend localStorage
# Browser Console:
localStorage.clear()

# 2. Clear MongoDB users
# MongoDB shell:
use wattwise
db.users.deleteMany({})

# 3. Restart backend
cd backend
npm start

# 4. Restart frontend
cd web2/wattwise
npm start
```

---

**Happy Testing! 🚀**

*Jika semua test pass, implementasi login/register sukses!* ✅
