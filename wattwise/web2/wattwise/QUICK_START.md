# ⚡ Quick Start - Login & Register

## 🚀 Jalankan dalam 3 Langkah

### 1️⃣ Start Backend
```bash
cd backend
npm start
```
✅ http://localhost:5000

### 2️⃣ Start Frontend
```bash
cd web2/wattwise
npm start
```
✅ http://localhost:3000

### 3️⃣ Test!
- Klik **"Masuk"** → Login
- Klik **"Daftar"** → Register

---

## 🔐 Test Credentials

### Quick Login Test:
```
Email: test@example.com
Password: test123
```
> Pastikan akun sudah terdaftar dulu!

### Quick Register Test:
```
Nama: Test User
Email: newuser@example.com
No Telp: 08123456789
Role: Owner
Password: Test123!
Konfirm: Test123!
```

---

## 🎯 Quick Checks

### ✅ Login Works If:
- Loading spinner muncul
- Redirect ke dashboard
- No error messages
- User name muncul di sidebar

### ✅ Register Works If:
- Loading spinner muncul
- Auto login & redirect
- Token tersimpan
- No error messages

---

## 🔍 Debug Checklist

### ❌ If Login/Register Fails:

1. **Backend running?**
   ```bash
   curl http://localhost:5000/api/
   ```

2. **MongoDB running?**
   ```bash
   mongosh
   ```

3. **Check browser console (F12)**
   - Red errors?
   - Network tab → Failed requests?

4. **Check localStorage**
   ```javascript
   localStorage.getItem('token')
   ```

---

## 📚 Full Documentation

Untuk dokumentasi lengkap, baca:
- **BACKEND_INTEGRATION.md** - Setup lengkap
- **TEST_LOGIN.md** - Testing guide
- **IMPLEMENTASI_LOGIN_REGISTER.md** - Implementation summary

---

**That's it! Happy coding! 🎉**
