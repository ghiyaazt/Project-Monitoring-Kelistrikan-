# 🔄 Restart & Test - API Integration

## ✅ Login Sudah Terhubung ke API!

Login component telah diupdate untuk menggunakan backend API.

---

## 🚀 Langkah untuk Testing

### 1. **Pastikan Backend Running**

```bash
cd backend
npm start
```

Cek di terminal, seharusnya ada:
```
Server running on port 5000
Connected to MongoDB
```

---

### 2. **Restart Frontend**

**PENTING:** Restart frontend untuk load environment variables!

```bash
# Stop frontend (Ctrl+C)
# Lalu start lagi:

cd web2/wattwise
npm start
```

Browser akan terbuka di `http://localhost:3000`

---

### 3. **Test Login dengan Backend API**

1. **Buka halaman login**

2. **Masukkan credentials yang VALID dari database:**
   - Email: `admin@example.com`
   - Password: `admin123456`

3. **Klik "Masuk"**

**Expected Result:**
- ✅ Console log: `Attempting login via API...`
- ✅ Console log: `Login successful: {user data}`
- ✅ Berhasil login dan redirect ke dashboard

**Jika password SALAH:**
- ❌ Muncul error: "Email atau password salah"
- ❌ Tidak bisa login

---

### 4. **Verify API Connection**

#### Check di Browser Console (F12):

Setelah login berhasil, check:

```javascript
// 1. Check token saved
console.log('Token:', localStorage.getItem('token'));

// 2. Check user saved
console.log('User:', localStorage.getItem('user'));

// 3. Test API call
fetch('http://localhost:5000/api/web2/kos', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(res => res.json())
.then(data => {
  console.log('Kos data from API:', data);
});
```

**Expected Output:**
- Token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)
- User: JSON object dengan user data
- Kos data: Array of kos (bisa kosong jika belum ada data)

---

## 🔍 Troubleshooting

### Problem: "Server tidak merespon"

**Check:**
```bash
# Test backend directly
curl http://localhost:5000/

# Should return JSON with endpoints list
```

**Solution:** Start backend dengan `cd backend && npm start`

---

### Problem: "Email atau password salah"

**Ini BENAR!** Artinya backend API sudah terhubung!

**Solution:** 
1. Gunakan credentials yang benar
2. Atau buat user baru via register
3. Atau check database untuk user yang ada

**Check database:**
```bash
# In backend folder
npm run check-users  # (if you have this script)

# Or manually check MongoDB
```

---

### Problem: Still using mock login (any password works)

**Check:**
1. File `.env` ada di `web2/wattwise/.env`?
2. Isi file: `REACT_APP_USE_API=true`?
3. Sudah restart frontend setelah edit `.env`?

**Solution:**
```bash
# Verify .env content
cat web2/wattwise/.env | grep USE_API

# Should show: REACT_APP_USE_API=true

# If not, edit and restart frontend
```

---

### Problem: Console shows "Using mock login"

Berarti `REACT_APP_USE_API` belum terbaca.

**Solution:**
1. Pastikan `.env` file ada di `web2/wattwise/.env`
2. Pastikan ada line: `REACT_APP_USE_API=true`
3. **RESTART frontend** (environment variables hanya load saat start)

---

## 📊 Test Matrix

### Test Case 1: Valid Credentials
- Email: `admin@example.com`
- Password: `admin123456`
- **Expected:** ✅ Login success, redirect to dashboard

### Test Case 2: Invalid Password
- Email: `admin@example.com`
- Password: `wrongpassword`
- **Expected:** ❌ Error: "Email atau password salah"

### Test Case 3: Invalid Email
- Email: `notexist@example.com`
- Password: `anything`
- **Expected:** ❌ Error: "Email atau password salah"

### Test Case 4: Empty Fields
- Email: (empty)
- Password: (empty)
- **Expected:** ❌ Error: "Email dan password wajib diisi"

---

## ✅ Success Indicators

Anda tahu API sudah terhubung jika:

1. ✅ Console log menunjukkan: `Attempting login via API...`
2. ✅ Password SALAH tidak bisa login (error muncul)
3. ✅ Password BENAR bisa login
4. ✅ Token tersimpan di localStorage
5. ✅ Console tidak ada log: `Using mock login (API disabled)`

---

## 🎯 Next Steps After Login Works

1. **Create User di Database:**
   ```bash
   # Test register via Postman or backend directly
   POST http://localhost:5000/api/auth/register
   {
     "nama": "Admin",
     "email": "admin@example.com",
     "no_telp": "08123456789",
     "password": "admin123456",
     "konfirmasiPassword": "admin123456"
   }
   ```

2. **Test Other API Features:**
   - Create Kos
   - Add Kamar
   - Add Penghuni
   - Create Payment

3. **Integrate Other Components:**
   - Dashboard (kos list)
   - Kamar detail page
   - Payment management

---

## 📝 Quick Commands

```bash
# Backend
cd backend && npm start

# Frontend (after env change - in new terminal)
cd web2/wattwise && npm start

# Check environment variable loaded
# In browser console:
console.log('API Mode:', process.env.REACT_APP_USE_API);

# Test backend
curl http://localhost:5000/

# Check if user exists in DB (if you have mongo shell)
mongo
use wattwise
db.users.find()
```

---

## 🎉 Summary

**Changed Files:**
1. ✅ `web2/wattwise/src/features/auth/components/Login/Login.tsx` - Updated to use authService
2. ✅ `web2/wattwise/.env` - Created with `REACT_APP_USE_API=true`

**What Happens Now:**
- ✅ Login menggunakan real backend API
- ✅ Password validation dari database
- ✅ JWT token tersimpan
- ✅ User data dari backend

**Test It:**
1. Restart frontend
2. Login dengan password SALAH → Harus gagal ❌
3. Login dengan password BENAR → Harus berhasil ✅

---

**🚀 Ready to test! Good luck!**
