# 📝 Update: Validasi Tambah Kos - Hanya Nama & Alamat Wajib

## 🔄 Perubahan yang Dilakukan

### Sebelum:
Field yang **wajib** diisi saat tambah kos baru:
- ✅ Nama Kos
- ✅ Alamat Jalan
- ✅ Alamat Kota ❌
- ✅ Alamat Provinsi ❌

### Sesudah:
Field yang **wajib** diisi:
- ✅ Nama Kos
- ✅ Alamat Jalan

Field yang **opsional**:
- ⚪ Kota
- ⚪ Provinsi
- ⚪ Kelurahan
- ⚪ Kecamatan
- ⚪ Kode Pos
- ⚪ Gambar
- ⚪ Deskripsi
- ⚪ Fasilitas
- ⚪ Peraturan
- ⚪ Kontak Pemilik

## 📄 File yang Diubah

### 1. Backend Controller (`kosController.js`)

**Perubahan validasi:**

```javascript
// SEBELUM
if (!namaKos || !alamat) {
  return res.status(400).json({
    success: false,
    message: 'Nama kos dan alamat harus diisi'
  });
}

if (!alamat.jalan || !alamat.kota || !alamat.provinsi) {
  return res.status(400).json({
    success: false,
    message: 'Jalan, kota, dan provinsi harus diisi'
  });
}
```

```javascript
// SESUDAH
// Validasi input - hanya nama kos dan alamat yang wajib
if (!namaKos) {
  return res.status(400).json({
    success: false,
    message: 'Nama kos harus diisi'
  });
}

if (!alamat) {
  return res.status(400).json({
    success: false,
    message: 'Alamat harus diisi'
  });
}

// Validasi alamat - minimal jalan harus ada
if (!alamat.jalan) {
  return res.status(400).json({
    success: false,
    message: 'Alamat jalan harus diisi'
  });
}
```

**Create dengan default values:**

```javascript
const kos = await Kos.create({
  namaKos,
  alamat: {
    jalan: alamat.jalan,
    kelurahan: alamat.kelurahan || '',
    kecamatan: alamat.kecamatan || '',
    kota: alamat.kota || '',
    provinsi: alamat.provinsi || '',
    kodePos: alamat.kodePos || ''
  },
  deskripsi: deskripsi || null,
  fasilitasUmum: fasilitasUmum || [],
  peraturan: peraturan || [],
  kontakPemilik: kontakPemilik || {},
  gambar: gambar || [],
  gambarProfil: gambarProfil || 0,
  ownerId: req.user._id,
  status: 'aktif'
});
```

### 2. Model Kos (`Kos.js`)

**Perubahan schema alamat:**

```javascript
// SEBELUM
kota: {
  type: String,
  required: [true, 'Kota harus diisi'],  // ❌ Required
  trim: true
},
provinsi: {
  type: String,
  required: [true, 'Provinsi harus diisi'],  // ❌ Required
  trim: true
}
```

```javascript
// SESUDAH
kota: {
  type: String,
  trim: true,
  default: null  // ✅ Optional
},
provinsi: {
  type: String,
  trim: true,
  default: null  // ✅ Optional
}
```

## 🎯 Manfaat Perubahan

### 1. **Lebih Fleksibel** 🔓
- Owner bisa tambah kos dengan cepat
- Bisa dilengkapi nanti (progressive disclosure)
- Tidak terlalu restrictive

### 2. **Better UX** ✨
- Form lebih sederhana
- Tidak memaksa isi data yang mungkin belum ada
- Proses lebih cepat

### 3. **Sesuai Use Case** 💡
- Kadang owner belum tahu detail lengkap alamat
- Bisa input nama dan jalan dulu, detail menyusul
- Edit bisa dilakukan nanti

## 📋 Request Body Example

### Minimal Request (Valid):
```json
{
  "namaKos": "Kos Mawar",
  "alamat": {
    "jalan": "Jl. Mawar No. 123"
  }
}
```

### Full Request (Juga Valid):
```json
{
  "namaKos": "Kos Mawar",
  "alamat": {
    "jalan": "Jl. Mawar No. 123",
    "kelurahan": "Sukahaji",
    "kecamatan": "Babakan Ciparay",
    "kota": "Bandung",
    "provinsi": "Jawa Barat",
    "kodePos": "40267"
  },
  "deskripsi": "Kos nyaman di pusat kota",
  "fasilitasUmum": ["WiFi", "Parkir", "Dapur"],
  "gambar": ["url1", "url2"],
  "gambarProfil": 0
}
```

## ✅ Response Success

```json
{
  "success": true,
  "message": "Kos berhasil ditambahkan",
  "data": {
    "_id": "...",
    "namaKos": "Kos Mawar",
    "alamat": {
      "jalan": "Jl. Mawar No. 123",
      "kota": null,
      "provinsi": null
    },
    "status": "aktif",
    "totalKamar": 0,
    "kamarTerisi": 0,
    "kamarKosong": 0,
    "createdAt": "2026-11-03T...",
    "updatedAt": "2026-11-03T..."
  }
}
```

## ❌ Response Error

### Error: Nama Kos Kosong
```json
{
  "success": false,
  "message": "Nama kos harus diisi"
}
```

### Error: Alamat Kosong
```json
{
  "success": false,
  "message": "Alamat harus diisi"
}
```

### Error: Jalan Kosong
```json
{
  "success": false,
  "message": "Alamat jalan harus diisi"
}
```

## 🔄 Frontend Impact

Frontend sudah sesuai dengan perubahan ini:

```typescript
// DaftarKos.tsx
const kosData = {
  namaKos: formKos.nama,
  alamat: {
    jalan: formKos.alamat,  // Hanya jalan yang diisi
    kota: '',               // Kosong
    provinsi: ''            // Kosong
  },
  gambar: formKos.gambar,
  gambarProfil: profileImageIndex
};
```

## 🧪 Testing

### Test Case 1: Minimal Input ✅
```bash
POST /api/kos
{
  "namaKos": "Kos Melati",
  "alamat": {
    "jalan": "Jl. Melati 10"
  }
}

Expected: 201 Created, kos berhasil dibuat
```

### Test Case 2: Full Input ✅
```bash
POST /api/kos
{
  "namaKos": "Kos Melati",
  "alamat": {
    "jalan": "Jl. Melati 10",
    "kota": "Bandung",
    "provinsi": "Jawa Barat"
  }
}

Expected: 201 Created, kos dengan alamat lengkap
```

### Test Case 3: Tanpa Nama ❌
```bash
POST /api/kos
{
  "alamat": {
    "jalan": "Jl. Melati 10"
  }
}

Expected: 400 Bad Request, "Nama kos harus diisi"
```

### Test Case 4: Tanpa Jalan ❌
```bash
POST /api/kos
{
  "namaKos": "Kos Melati",
  "alamat": {
    "kota": "Bandung"
  }
}

Expected: 400 Bad Request, "Alamat jalan harus diisi"
```

## 📝 Notes

1. **Backward Compatible:** Kos yang sudah ada tidak terpengaruh
2. **Update Feature:** Owner bisa update kos nanti untuk lengkapi data
3. **Validation:** Tetap ada validasi untuk format (kode pos 5 digit, dll)
4. **Virtual Fields:** `alamatLengkap` tetap bekerja, hanya skip field null

## 🚀 Deployment

Perubahan ini aman untuk di-deploy karena:
- ✅ Tidak break existing data
- ✅ Lebih permissive (tidak restrictive)
- ✅ Frontend sudah compatible
- ✅ Validation tetap ada untuk field required

---

**Updated:** 3 November 2026  
**Status:** ✅ IMPLEMENTED  
**Impact:** Membuat proses tambah kos lebih cepat dan fleksibel
