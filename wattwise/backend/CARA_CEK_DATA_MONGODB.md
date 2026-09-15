# 📊 Cara Cek Data di MongoDB

## ✅ Status Terkini
**Total Data di Database: 115 records** (dan terus bertambah!)

---

## 🔍 3 Cara Melihat Data

### 1️⃣ Via Script Test (Paling Cepat)

```bash
cd backend
npm run test:db
```

**Output:**
```
✅ MongoDB connected successfully!
📊 Total data in database: 115
📋 Latest 5 data from database
```

**Kelebihan:**
- ✅ Cepat, tinggal run command
- ✅ Langsung tampil di terminal
- ✅ Sudah format rapi

---

### 2️⃣ Via MongoDB Atlas Web Interface (Recommended)

**Step-by-step:**

1. **Buka MongoDB Atlas**
   - Go to: https://cloud.mongodb.com/
   - Login dengan akun kamu (redgmaing66_db_user)

2. **Pilih Cluster**
   - Klik cluster **Cluster0**
   - Klik tombol **"Browse Collections"**

3. **Lihat Data**
   - Database: Pilih database kamu (kemungkinan `test` atau `wattwise`)
   - Collection: `sensor_data`
   - Akan tampil semua data dalam format JSON

4. **Filter & Query**
   - Bisa filter by device_id, date, dll
   - Bisa sort berdasarkan timestamp
   - Bisa export ke JSON/CSV

**Screenshot path:**
```
Atlas Dashboard 
  → Cluster0 
    → Browse Collections 
      → sensor_data 
        → 115 documents
```

**Kelebihan:**
- ✅ Visual interface yang mudah
- ✅ Bisa filter dan search
- ✅ Bisa edit data manual
- ✅ Bisa export data
- ✅ Real-time update

---

### 3️⃣ Via REST API (Dari Browser/Postman)

**A. Check dari Browser**

Buka browser dan akses:
```
http://localhost:5000/api/sensor/latest
```

**B. Check All Data**
```
http://localhost:5000/api/sensor/all
```

**C. Menggunakan curl**
```bash
curl http://localhost:5000/api/sensor/latest
```

**Kelebihan:**
- ✅ Gak perlu login
- ✅ Bisa integrate ke app
- ✅ Format JSON ready-to-use

**Catatan:** Backend harus running dulu!

---

### 4️⃣ Via MongoDB Compass (Desktop App) [BONUS]

**Download:**
https://www.mongodb.com/products/tools/compass

**Cara Connect:**
1. Install MongoDB Compass
2. Buka aplikasi
3. Paste connection string dari `.env`:
   ```
   mongodb+srv://redgmaing66_db_user:IwS9zLMfTtMz8p5m@cluster0.mcteeff.mongodb.net/?appName=Cluster0
   ```
4. Klik **Connect**
5. Expand database → collection `sensor_data`
6. Lihat semua data dalam table view

**Kelebihan:**
- ✅ Desktop app, lebih powerful
- ✅ Query builder visual
- ✅ Aggregation pipeline builder
- ✅ Performance metrics
- ✅ Index management

---

## 📊 Struktur Data yang Tersimpan

Setiap data punya format seperti ini:

```json
{
  "_id": "66d8f...",
  "device_id": "esp32-pzem-01",
  "room_id": "room-01",
  "voltage": 232.7,
  "current": 0,
  "power": 0,
  "energy": 0.095,
  "event": "pzem_data",
  "status": "NORMAL",
  "relay_status": "ON",
  "time_delay_val": 0,
  "curva_type": "Normal Inverse",
  "motion": false,
  "timestamp": "2026-09-08T14:35:28.000Z",
  "createdAt": "2026-09-08T14:35:28.123Z",
  "updatedAt": "2026-09-08T14:35:28.123Z",
  "__v": 0
}
```

---

## 🧪 Test Real-time Data Masuk

**Cara paling mudah monitor data masuk:**

1. **Jalankan Backend**
   ```bash
   npm start
   ```

2. **Watch Console Log**
   Setiap data masuk akan tampil:
   ```
   📩 Received MQTT data: {...}
   💾 Data saved to MongoDB: {
     device_id: 'esp32-pzem-01',
     voltage: 232.7,
     current: 0,
     power: 0,
     energy: 0.095,
     status: 'NORMAL',
     relay_status: 'ON'
   }
   ```

3. **Check di Terminal Lain**
   ```bash
   npm run test:db
   ```
   Angka total data akan terus naik!

---

## 🎯 Quick Commands

```bash
# Cek koneksi MongoDB
npm run test:db

# Start backend (lihat log real-time)
npm start

# Test via curl
curl http://localhost:5000/api/sensor/latest

# Test via PowerShell
Invoke-WebRequest http://localhost:5000/api/sensor/latest
```

---

## 📈 Monitoring Data Growth

**Cara track berapa data masuk per menit:**

Run command ini beberapa kali:
```bash
npm run test:db
```

Output:
```
1st run: 📊 Total data in database: 115
2nd run: 📊 Total data in database: 120  (+ 5 data)
3rd run: 📊 Total data in database: 125  (+ 5 data)
```

Berarti ESP32 kirim data sekitar 5-10 detik sekali. ✅

---

## 🐛 Troubleshooting

### ❌ "MongoDB connection failed"
**Solusi:**
1. Cek internet connection
2. Verify `.env` connection string
3. Check MongoDB Atlas cluster status

### ❌ "Total data: 0"
**Solusi:**
1. Pastikan backend pernah di-run
2. Cek ESP32 sudah kirim data
3. Lihat log error di console

### ❌ REST API tidak bisa diakses
**Solusi:**
1. Pastikan backend running (`npm start`)
2. Check port 5000 tidak dipakai app lain
3. Test dengan `curl localhost:5000`

---

## 🎉 Summary

**3 Cara Paling Praktis:**

1. **Terminal** → `npm run test:db` (Quick check)
2. **MongoDB Atlas Web** → Browse Collections (Visual)
3. **Browser** → `http://localhost:5000/api/sensor/latest` (JSON API)

**Semua cara di atas membuktikan:**
✅ Backend connected to MongoDB  
✅ Data masuk real-time dari ESP32  
✅ Total 115+ records tersimpan  
✅ Ready untuk mobile app integration  

---

## 🔗 Links

- MongoDB Atlas: https://cloud.mongodb.com/
- MongoDB Compass: https://www.mongodb.com/products/tools/compass
- REST API Docs: Lihat `README.md`

**Data kamu sudah aman tersimpan di cloud! ☁️📊**
