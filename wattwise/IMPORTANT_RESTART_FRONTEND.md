# ⚠️ PENTING: CARA RESTART FRONTEND YANG BENAR

## 🔴 Masalah

Jika password SALAH masih bisa login, berarti **frontend belum restart dengan benar** setelah file `.env` dibuat.

---

## ✅ Solusi: Restart Frontend dengan Benar

### Langkah 1: STOP Frontend

Di terminal tempat frontend running, tekan:
```
Ctrl + C
```

Tunggu sampai proses benar-benar berhenti.

---

### Langkah 2: CLEAR Cache (Opsional tapi Direkomendasikan)

```bash
# Di folder web2/wattwise
cd web2/wattwise

# Clear node cache
npm cache clean --force

# Atau hapus build cache
rm -rf node_modules/.cache
```

**Windows PowerShell:**
```powershell
cd web2\wattwise
npm cache clean --force
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
```

---

### Langkah 3: START Frontend Lagi

```bash
npm start
```

Browser akan terbuka otomatis di `http://localhost:3000`

---

### Langkah 4: VERIFY di Browser Console

1. Buka Developer Tools (F12)
2. Refresh halaman (Ctrl + R atau F5)
3. Lihat console

**Seharusnya muncul:**
```
=== LOGIN COMPONENT DEBUG ===
REACT_APP_USE_API: true
USE_API (parsed): true
API URL: http://localhost:5000/api
============================
```

**Jika muncul `undefined` atau `false` → Frontend belum load .env dengan benar**

---

## 🧪 Test Apakah Sudah Benar

### Test 1: Check Console Log

Saat halaman login terbuka, **langsung** check console (F12).

**HARUS ADA:**
```
=== LOGIN COMPONENT DEBUG ===
REACT_APP_USE_API: true
```

**JIKA TIDAK ADA** atau **REACT_APP_USE_API: undefined** → Restart lagi!

---

### Test 2: Try Login dengan Password Salah

1. Email: `admin@example.com`
2. Password: `salahpassword`
3. Klik "Masuk"

**JIKA API MODE AKTIF:**
- Console: `🔌 Attempting login via REAL API...`
- Result: ❌ Error muncul: "Email atau password salah"
- Login GAGAL

**JIKA MASIH MOCK MODE:**
- Console: `⚠️ Using MOCK login (API disabled)`
- Result: ✅ Login berhasil (SALAH!)
- Berarti frontend belum restart dengan benar

---

## 🔧 Troubleshooting

### Problem 1: Console tidak muncul log debug

**Kemungkinan:**
- Frontend belum di-refresh
- Cache browser

**Solution:**
```bash
# Hard refresh browser
Ctrl + Shift + R

# Or clear browser cache
Ctrl + Shift + Delete → Clear browsing data
```

---

### Problem 2: REACT_APP_USE_API masih undefined

**Kemungkinan:**
- File `.env` tidak ada di `web2/wattwise/.env`
- Typo di nama file atau isi file

**Solution:**
```bash
# Check file exists
ls web2/wattwise/.env

# Check content
cat web2/wattwise/.env | grep USE_API

# Should show: REACT_APP_USE_API=true
```

**Jika file tidak ada atau isi salah:**
```bash
# Create/edit file
echo "REACT_APP_USE_API=true" >> web2/wattwise/.env
echo "REACT_APP_API_URL=http://localhost:5000/api" >> web2/wattwise/.env
```

Lalu **restart frontend lagi**.

---

### Problem 3: Masih menggunakan mock setelah restart berkali-kali

**Kemungkinan:**
- File `.env` di lokasi yang salah
- React not picking up env variables

**Solution:**

1. **Pastikan lokasi file benar:**
   ```
   Project-Monitoring-Kelistrikan-/
   └── wattwise/
       └── web2/
           └── wattwise/
               ├── .env          ← HARUS DI SINI!
               ├── src/
               ├── public/
               └── package.json
   ```

2. **Pastikan format file benar:**
   ```bash
   # File .env (no .txt extension!)
   REACT_APP_USE_API=true
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Try creating .env.local instead:**
   ```bash
   # .env.local has higher priority
   cp web2/wattwise/.env web2/wattwise/.env.local
   ```

---

## ✅ Checklist - Pastikan Semua Ini Benar

- [ ] File `.env` ada di `web2/wattwise/.env`
- [ ] Isi file ada `REACT_APP_USE_API=true`
- [ ] Frontend di-**STOP** dengan Ctrl+C
- [ ] Frontend di-**START** lagi dengan `npm start`
- [ ] Browser di-**REFRESH** (F5)
- [ ] Console menunjukkan debug log
- [ ] Console menunjukkan `USE_API: true`

---

## 🎯 Expected Behavior Setelah Restart Benar

### Saat Halaman Login Terbuka:

**Console menunjukkan:**
```
=== LOGIN COMPONENT DEBUG ===
REACT_APP_USE_API: true
USE_API (parsed): true
API URL: http://localhost:5000/api
============================
```

### Saat Login dengan Password SALAH:

**Console menunjukkan:**
```
🔌 Attempting login via REAL API...
Email: admin@example.com
❌ Login error: Email atau password salah
```

**UI menunjukkan:**
- Error message muncul
- Login GAGAL (tidak redirect)

### Saat Login dengan Password BENAR:

**Console menunjukkan:**
```
🔌 Attempting login via REAL API...
Email: admin@example.com
✅ Login successful: {nama: "Admin", email: "admin@example.com", ...}
```

**UI menunjukkan:**
- Login BERHASIL
- Redirect ke dashboard

---

## 🚨 Jika Masih Tidak Berhasil

Coba cara **nuclear option**:

```bash
# 1. Stop frontend
Ctrl + C

# 2. Delete node_modules
cd web2/wattwise
rm -rf node_modules
rm -rf .cache
rm -rf build

# 3. Clear npm cache
npm cache clean --force

# 4. Reinstall
npm install

# 5. Start fresh
npm start
```

**Windows PowerShell:**
```powershell
cd web2\wattwise
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue
npm cache clean --force
npm install
npm start
```

---

## 📞 Final Check Command

Jalankan ini di console browser setelah frontend restart:

```javascript
// Check env variables
console.log('Environment Check:');
console.log('- USE_API:', process.env.REACT_APP_USE_API);
console.log('- API_URL:', process.env.REACT_APP_API_URL);
console.log('- Node Env:', process.env.NODE_ENV);

// Expected output:
// - USE_API: true
// - API_URL: http://localhost:5000/api
// - Node Env: development
```

---

**Jika setelah mengikuti semua langkah masih tidak berhasil, screenshot console log dan share untuk debugging lebih lanjut!**
