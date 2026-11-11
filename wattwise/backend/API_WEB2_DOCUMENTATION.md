# 📚 WattWise API Documentation - Web2 Integration

## Base URL
```
http://localhost:5000/api/web2
```

**Note**: All endpoints require authentication via JWT token in Authorization header.

```
Authorization: Bearer <your-jwt-token>
```

---

## 🏠 KOS Management

### 1. Get All Kos
**GET** `/api/web2/kos`

Get all kos owned by the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "nama": "Kos Melati",
      "alamat": "Jl. Melati No. 123, Kelurahan ABC, Kecamatan XYZ, Bandung, Jawa Barat, 40123",
      "jumlahKamar": 10,
      "kamarTerisi": 7,
      "hargaMin": 500000,
      "hargaMax": 1500000,
      "fasilitas": ["WiFi", "Kamar Mandi Dalam", "AC"],
      "kamarList": [
        {
          "id": "...",
          "nama": "Kamar 101",
          "status": "terisi",
          "hargaSewa": 800000,
          ...
        }
      ],
      "gambar": ["url1.jpg", "url2.jpg"],
      "gambarProfil": 0
    }
  ]
}
```

---

### 2. Get Single Kos
**GET** `/api/web2/kos/:kosId`

Get detailed information of a single kos with full kamarList.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nama": "Kos Melati",
    "alamat": "Jl. Melati No. 123, ...",
    "jumlahKamar": 10,
    "kamarTerisi": 7,
    "hargaMin": 500000,
    "hargaMax": 1500000,
    "fasilitas": ["WiFi", "Kamar Mandi Dalam", "AC"],
    "kamarList": [
      {
        "id": "...",
        "nama": "Kamar 101",
        "status": "terisi",
        "penghuniList": [
          {
            "id": "...",
            "nama": "Ahmad Rizki",
            "email": "ahmad@example.com",
            "telepon": "08123456789",
            "tanggalMasuk": "2026-01-15T00:00:00.000Z"
          }
        ],
        "hargaSewa": 800000,
        "luasKamar": 12,
        "fasilitas": ["AC", "Kasur", "Lemari"],
        "maxPenghuni": 2,
        "gambar": [],
        "gambarProfil": 0,
        "payments": [
          {
            "id": "...",
            "bulan": "Januari",
            "tahun": 2026,
            "jumlah": 800000,
            "status": "sudah_bayar",
            "tanggalBayar": "2026-01-10",
            "metodePembayaran": "Transfer Bank"
          }
        ]
      }
    ],
    "gambar": [],
    "gambarProfil": 0
  }
}
```

---

### 3. Create Kos
**POST** `/api/web2/kos`

Create a new kos.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nama": "Kos Melati",
  "alamat": "Jl. Melati No. 123, Kelurahan ABC, Kecamatan XYZ, Bandung, Jawa Barat, 40123",
  "fasilitas": ["WiFi", "Kamar Mandi Dalam", "AC"],
  "gambar": ["url1.jpg", "url2.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kos berhasil dibuat",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "nama": "Kos Melati",
    "alamat": "Jl. Melati No. 123, ...",
    "jumlahKamar": 0,
    "kamarTerisi": 0,
    "hargaMin": 0,
    "hargaMax": 0,
    "fasilitas": ["WiFi", "Kamar Mandi Dalam", "AC"],
    "kamarList": [],
    "gambar": ["url1.jpg", "url2.jpg"],
    "gambarProfil": 0
  }
}
```

---

### 4. Update Kos
**PUT** `/api/web2/kos/:kosId`

Update kos details.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:** (all fields optional)
```json
{
  "nama": "Kos Melati Updated",
  "alamat": "Jl. Melati Baru No. 456, ...",
  "fasilitas": ["WiFi", "AC", "Dapur"],
  "gambar": ["new-url1.jpg"],
  "gambarProfil": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kos berhasil diupdate",
  "data": { ... }
}
```

---

### 5. Delete Kos
**DELETE** `/api/web2/kos/:kosId`

Delete kos (soft delete - sets status to 'nonaktif').

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Kos berhasil dihapus"
}
```

**Error (if kamar terisi > 0):**
```json
{
  "success": false,
  "message": "Tidak dapat menghapus kos yang masih memiliki penghuni"
}
```

---

## 🚪 KAMAR (Room) Management

### 1. Get Kamar by ID
**GET** `/api/web2/kos/:kosId/kamar/:kamarId`

Get detailed information of a kamar.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "nama": "Kamar 101",
    "status": "terisi",
    "penghuniList": [...],
    "hargaSewa": 800000,
    "luasKamar": 12,
    "fasilitas": ["AC", "Kasur", "Lemari"],
    "maxPenghuni": 2,
    "gambar": [],
    "gambarProfil": 0,
    "payments": [...]
  }
}
```

---

### 2. Create Kamar
**POST** `/api/web2/kos/:kosId/kamar`

Add a new room to kos.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nama": "Kamar 101",
  "hargaSewa": 800000,
  "luasKamar": 12,
  "fasilitas": ["AC", "Kasur", "Lemari"],
  "maxPenghuni": 2,
  "gambar": []
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kamar berhasil ditambahkan",
  "data": { ... }
}
```

---

### 3. Update Kamar
**PUT** `/api/web2/kos/:kosId/kamar/:kamarId`

Update kamar details.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:** (all fields optional)
```json
{
  "nama": "Kamar 101A",
  "hargaSewa": 850000,
  "luasKamar": 15,
  "fasilitas": ["AC", "Kasur", "Lemari", "Meja"],
  "maxPenghuni": 2,
  "gambar": [],
  "gambarProfil": 0,
  "status": "kosong"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kamar berhasil diupdate",
  "data": { ... }
}
```

---

### 4. Delete Kamar
**DELETE** `/api/web2/kos/:kosId/kamar/:kamarId`

Delete kamar (only if status = 'kosong').

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Kamar berhasil dihapus"
}
```

**Error (if kamar terisi):**
```json
{
  "success": false,
  "message": "Tidak dapat menghapus kamar yang masih terisi"
}
```

---

## 👤 PENGHUNI (Tenant) Management

### 1. Add Penghuni to Kamar
**POST** `/api/web2/kos/:kosId/kamar/:kamarId/penghuni`

Add a tenant to a room.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nama": "Ahmad Rizki",
  "email": "ahmad@example.com",
  "telepon": "08123456789",
  "tanggalMasuk": "2026-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Penghuni berhasil ditambahkan",
  "data": {
    "id": "...",
    "nama": "Ahmad Rizki",
    "email": "ahmad@example.com",
    "telepon": "08123456789",
    "tanggalMasuk": "2026-01-15T00:00:00.000Z"
  }
}
```

**Notes:**
- Auto-updates kamar.status to 'terisi'
- Auto-updates kos statistics

---

### 2. Update Penghuni
**PUT** `/api/web2/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId`

Update tenant information.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:** (all fields optional)
```json
{
  "nama": "Ahmad Rizki Updated",
  "email": "ahmad.new@example.com",
  "telepon": "08987654321",
  "tanggalMasuk": "2026-01-20"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data penghuni berhasil diupdate",
  "data": { ... }
}
```

---

### 3. Remove Penghuni
**DELETE** `/api/web2/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId`

Remove tenant from room.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Penghuni berhasil dihapus"
}
```

**Notes:**
- Auto-updates kamar.status to 'kosong' if no remaining penghuni
- Auto-updates kos statistics

---

## 💰 PAYMENT Management

### 1. Get Payments by Kamar
**GET** `/api/web2/kos/:kosId/kamar/:kamarId/payments`

Get all payments for a room.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:** (all optional)
- `tahun`: Filter by year (e.g., 2026)
- `bulan`: Filter by month (e.g., "Januari")
- `status`: Filter by status (lunas, sudah_bayar, belum_bayar, terlambat)

**Example:**
```
GET /api/web2/kos/123/kamar/456/payments?tahun=2026&status=belum_bayar
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "bulan": "Januari",
      "tahun": 2026,
      "jumlah": 800000,
      "status": "sudah_bayar",
      "tanggalBayar": "2026-01-10",
      "metodePembayaran": "Transfer Bank",
      "tanggalJatuhTempo": "2026-01-05",
      "buktiPembayaran": "https://example.com/bukti.jpg"
    }
  ]
}
```

---

### 2. Create Payment
**POST** `/api/web2/kos/:kosId/kamar/:kamarId/payments`

Create a payment record.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "penghuniId": "507f1f77bcf86cd799439012",
  "bulan": "Januari",
  "tahun": 2026,
  "jumlah": 800000,
  "tanggalJatuhTempo": "2026-01-05",
  "keterangan": "Pembayaran sewa bulan Januari"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pembayaran berhasil dibuat",
  "data": { ... }
}
```

**Notes:**
- Status auto-set to 'belum_bayar' or 'terlambat' based on tanggalJatuhTempo
- Cannot create duplicate (same kamar, bulan, tahun)

---

### 3. Update Payment
**PUT** `/api/web2/kos/:kosId/kamar/:kamarId/payments/:paymentId`

Update payment details.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:** (all fields optional)
```json
{
  "status": "sudah_bayar",
  "tanggalBayar": "2026-01-10",
  "metodePembayaran": "Transfer Bank",
  "buktiPembayaran": "https://example.com/bukti.jpg",
  "keterangan": "Lunas"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pembayaran berhasil diupdate",
  "data": { ... }
}
```

**Notes:**
- If status changed to 'sudah_bayar' or 'lunas', tanggalBayar auto-set to now if not provided

---

### 4. Confirm Payment
**POST** `/api/web2/kos/:kosId/kamar/:kamarId/payments/:paymentId/confirm`

Confirm payment (shortcut for updating to 'sudah_bayar').

**Headers:**
```
Authorization: Bearer <token>
```

**Body:** (all optional)
```json
{
  "metodePembayaran": "Transfer Bank",
  "buktiPembayaran": "https://example.com/bukti.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pembayaran berhasil dikonfirmasi",
  "data": { ... }
}
```

**Notes:**
- Auto-sets status to 'sudah_bayar'
- Auto-sets tanggalBayar to now

---

## 📋 Data Format Reference

### Kos Object
```typescript
{
  id: string;
  nama: string;
  alamat: string; // Full address string
  jumlahKamar: number;
  kamarTerisi: number;
  hargaMin: number;
  hargaMax: number;
  fasilitas: string[];
  kamarList: Kamar[];
  gambar: string[];
  gambarProfil: number;
}
```

### Kamar Object
```typescript
{
  id: string;
  nama: string;
  status: 'terisi' | 'kosong';
  penghuniList: Penghuni[];
  hargaSewa: number;
  luasKamar: number;
  fasilitas: string[];
  maxPenghuni: number;
  gambar: string[];
  gambarProfil: number;
  payments: Payment[];
}
```

### Penghuni Object
```typescript
{
  id: string;
  nama: string;
  email: string;
  telepon: string;
  tanggalMasuk: string; // ISO date
}
```

### Payment Object
```typescript
{
  id: string;
  bulan: string; // "Januari", "Februari", etc.
  tahun: number;
  jumlah: number;
  status: 'lunas' | 'sudah_bayar' | 'belum_bayar' | 'terlambat';
  tanggalBayar?: string; // ISO date (YYYY-MM-DD)
  metodePembayaran?: string;
  tanggalJatuhTempo?: string; // ISO date (YYYY-MM-DD)
  buktiPembayaran?: string; // URL
}
```

---

## 🔐 Authentication & Authorization

### Authentication
All endpoints require JWT token:
```
Authorization: Bearer <your-jwt-token>
```

Get token from login endpoint:
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Authorization
- **owner**, **admin**: Can manage kos, kamar, penghuni, payments
- Ownership is automatically checked via `ownerId` in models

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Nama, email, dan telepon harus diisi"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Akses ditolak. Silakan login terlebih dahulu"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Kamar tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Terjadi kesalahan saat mengambil data kos",
  "error": "MongoError: ..."
}
```

---

## 📊 Implementation Status

### ✅ Phase 1 & 2 Completed
- [x] Kos Management (5 endpoints)
- [x] Kamar Management (4 endpoints)
- [x] Penghuni Management (3 endpoints)
- [x] Payment Management (4 endpoints)

### 🚧 Phase 3 & 4 (TODO)
- [ ] Device Management
- [ ] Perangkat Management
- [ ] Group Management
- [ ] Financial Reports

---

**Generated**: 2026-11-03  
**Version**: 1.0.0  
**Status**: Phase 1 & 2 Completed ✅
