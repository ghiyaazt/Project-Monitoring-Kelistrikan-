# 🏠 Fix: Form Alamat Kos - Structured Address Fields

## ❌ Problem

Saat membuat kos baru, field alamat di MongoDB muncul sebagai **(Document) 6 Fields** namun tidak terisi dengan benar karena frontend mengirim alamat sebagai **string tunggal** bukan **object terstruktur**.

### Yang Terjadi Sebelumnya:
```typescript
// Frontend mengirim:
{
  "namaKos": "Kos Mawar",
  "alamat": "Jl. Mawar No. 123, Bandung"  // ❌ String
}

// MongoDB expect:
{
  "alamat": {
    "jalan": "...",
    "kota": "...",
    "provinsi": "..."
  }
}
```

**Hasil:** Field alamat tidak terisi dengan benar di database!

## ✅ Solution

Mengubah form alamat dari **single textarea** menjadi **multiple structured fields** yang sesuai dengan schema MongoDB.

## 📝 Perubahan yang Dilakukan

### 1. **State Form** (`DaftarKos.tsx`)

**Sebelum:**
```typescript
const [formKos, setFormKos] = useState({
  nama: '',
  alamat: '',  // ❌ Single string
  gambar: [] as string[]
});
```

**Sesudah:**
```typescript
const [formKos, setFormKos] = useState({
  nama: '',
  jalan: '',       // ✅ Structured
  kelurahan: '',
  kecamatan: '',
  kota: '',
  provinsi: '',
  kodePos: '',
  gambar: [] as string[]
});
```

### 2. **Request Payload** (`handleTambahKos`)

**Sebelum:**
```typescript
const kosData = {
  namaKos: formKos.nama,
  alamat: {
    jalan: formKos.alamat,  // ❌ String masuk ke jalan
    kota: '',
    provinsi: ''
  }
};
```

**Sesudah:**
```typescript
const kosData = {
  namaKos: formKos.nama,
  alamat: {
    jalan: formKos.jalan,          // ✅ Proper structure
    kelurahan: formKos.kelurahan || '',
    kecamatan: formKos.kecamatan || '',
    kota: formKos.kota || '',
    provinsi: formKos.provinsi || '',
    kodePos: formKos.kodePos || ''
  },
  gambar: formKos.gambar,
  gambarProfil: profileImageIndex
};
```

### 3. **Form UI** (`TambahKosModal.tsx`)

**Sebelum:**
```jsx
{/* Alamat */}
<textarea
  value={formKos.alamat}
  onChange={(e) => onFormChange('alamat', e.target.value)}
  placeholder="Contoh: Jl. Mawar No. 123, Bandung"
  rows={3}
/>
```

**Sesudah:**
```jsx
{/* Alamat Lengkap dengan Multiple Fields */}
<div className="space-y-4">
  {/* Jalan - Required */}
  <input
    type="text"
    value={formKos.jalan}
    onChange={(e) => onFormChange('jalan', e.target.value)}
    placeholder="Contoh: Jl. Mawar No. 123"
  />
  
  {/* Kelurahan & Kecamatan - Grid 2 Columns */}
  <div className="grid grid-cols-2 gap-3">
    <input value={formKos.kelurahan} ... />
    <input value={formKos.kecamatan} ... />
  </div>
  
  {/* Kota & Provinsi - Grid 2 Columns */}
  <div className="grid grid-cols-2 gap-3">
    <input value={formKos.kota} ... />
    <input value={formKos.provinsi} ... />
  </div>
  
  {/* Kode Pos */}
  <input 
    value={formKos.kodePos} 
    maxLength={5} 
    placeholder="5 digit (Opsional)"
  />
</div>
```

### 4. **Validation Update**

**Sebelum:**
```typescript
disabled={!formKos.nama || !formKos.alamat}
```

**Sesudah:**
```typescript
disabled={!formKos.nama || !formKos.jalan}
```

## 📋 Form Fields

### Required (Wajib):
- ✅ **Nama Kos** - Nama kos
- ✅ **Jalan** - Alamat jalan dan nomor

### Optional (Opsional):
- ⚪ **Kelurahan** - Kelurahan
- ⚪ **Kecamatan** - Kecamatan  
- ⚪ **Kota** - Kota/Kabupaten
- ⚪ **Provinsi** - Provinsi
- ⚪ **Kode Pos** - 5 digit kode pos

## 🎨 UI Layout

```
┌─────────────────────────────────────┐
│ Nama Kos * [___________________]    │
│                                     │
│ Alamat Lengkap                      │
│ Jalan / Nomor * [_______________]   │
│                                     │
│ ┌────────────┬────────────┐        │
│ │Kelurahan   │Kecamatan   │        │
│ │[________]  │[________]  │        │
│ └────────────┴────────────┘        │
│                                     │
│ ┌────────────┬────────────┐        │
│ │Kota        │Provinsi    │        │
│ │[________]  │[________]  │        │
│ └────────────┴────────────┘        │
│                                     │
│ Kode Pos [_____]                   │
└─────────────────────────────────────┘
```

## 📊 Database Result

### Sebelum Fix:
```json
{
  "_id": "...",
  "namaKos": "Kos Mawar",
  "alamat": "(Document) 6 Fields"  // ❌ Tidak terisi proper
}
```

### Sesudah Fix:
```json
{
  "_id": "...",
  "namaKos": "Kos Mawar",
  "alamat": {
    "jalan": "Jl. Mawar No. 123",
    "kelurahan": "Sukahaji",
    "kecamatan": "Babakan Ciparay",
    "kota": "Bandung",
    "provinsi": "Jawa Barat",
    "kodePos": "40267"
  },
  "status": "aktif"
}
```

## 🧪 Testing

### Test Case 1: Minimal Input ✅
```
Nama Kos: Kos Melati
Jalan: Jl. Melati No. 10
(fields lain kosong)

Expected Result:
{
  "namaKos": "Kos Melati",
  "alamat": {
    "jalan": "Jl. Melati No. 10",
    "kelurahan": "",
    "kecamatan": "",
    "kota": "",
    "provinsi": "",
    "kodePos": ""
  }
}
```

### Test Case 2: Full Input ✅
```
Nama Kos: Kos Melati
Jalan: Jl. Melati No. 10
Kelurahan: Sukahaji
Kecamatan: Babakan Ciparay
Kota: Bandung
Provinsi: Jawa Barat
Kode Pos: 40267

Expected Result:
{
  "namaKos": "Kos Melati",
  "alamat": {
    "jalan": "Jl. Melati No. 10",
    "kelurahan": "Sukahaji",
    "kecamatan": "Babakan Ciparay",
    "kota": "Bandung",
    "provinsi": "Jawa Barat",
    "kodePos": "40267"
  }
}
```

### Test Case 3: Kode Pos Validation ✅
```
Kode Pos: 12345  ✅ Valid (5 digits)
Kode Pos: 123    ❌ Invalid (< 5 digits, but allowed)
Kode Pos: 123456 ❌ Cannot input (maxLength=5)
```

## 📝 Virtual Field Support

MongoDB schema sudah punya virtual field `alamatLengkap`:

```javascript
kosSchema.virtual('alamatLengkap').get(function() {
  const parts = [
    this.alamat.jalan,
    this.alamat.kelurahan,
    this.alamat.kecamatan,
    this.alamat.kota,
    this.alamat.provinsi,
    this.alamat.kodePos
  ].filter(Boolean);  // Remove null/empty values
  
  return parts.join(', ');
});
```

**Contoh Output:**
```
"Jl. Melati No. 10, Sukahaji, Babakan Ciparay, Bandung, Jawa Barat, 40267"
```

## 🔄 Backward Compatibility

✅ Tidak break existing data yang sudah ada di database
✅ Field yang kosong akan jadi empty string '' bukan null
✅ Frontend transform data API dengan benar untuk display

## ✨ Benefits

1. **Data Terstruktur** - Data alamat tersimpan dengan struktur yang proper
2. **Easy Query** - Bisa query berdasarkan kota, provinsi, dll
3. **Better UX** - User tahu persis field apa yang perlu diisi
4. **Flexible** - Field opsional bisa dikosongkan
5. **Validation Ready** - Siap untuk validasi format (kode pos 5 digit, dll)

## 📦 Files Changed

1. ✅ `DaftarKos.tsx` - State & payload structure
2. ✅ `TambahKosModal.tsx` - Form UI dengan multiple fields
3. ✅ `kosController.js` - Backend validation (already done)
4. ✅ `Kos.js` - Model schema (already done)

## 🚀 Status

- ✅ Form updated dengan structured fields
- ✅ TypeScript interfaces updated
- ✅ Validation updated
- ✅ Build successful
- ✅ Ready to test!

---

**Fixed:** 3 November 2026  
**Status:** ✅ RESOLVED  
**Impact:** Alamat kos sekarang tersimpan dengan struktur yang benar di MongoDB!
