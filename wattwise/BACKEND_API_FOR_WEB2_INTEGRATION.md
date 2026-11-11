# Backend API Implementation for Web2 Frontend Integration

## 📋 Overview

Dokumen ini berisi **implementasi backend API** yang disesuaikan dengan kebutuhan frontend web2. 
Frontend web2 saat ini menggunakan **localStorage dan mock data**, sehingga backend perlu menyediakan endpoint yang **match dengan struktur data yang sudah ada di frontend**.

---

## 🎯 Integration Strategy

**DO NOT MODIFY FRONTEND** - Backend harus menyesuaikan dengan:
1. Data structures yang sudah didefinisikan di `src/context/types.ts`
2. Mock data formats di `src/data/mockData.ts`
3. Expected API response formats

---

## 📊 Frontend Data Structures (Reference)

### 1. Kos & Kamar Data

```typescript
// Frontend expects this structure
interface Kos {
  id: string;
  nama: string;
  alamat: string;
  jumlahKamar: number;
  kamarTerisi: number;
  hargaMin: number;
  hargaMax: number;
  fasilitas: string[];
  kamarList: Kamar[];
  gambar?: string[];
  gambarProfil?: number;  // index of profile image in gambar array
}

interface Kamar {
  id: string;
  nama: string;
  status: 'terisi' | 'kosong';
  penghuniList?: Penghuni[];
  hargaSewa: number;
  luasKamar: number;
  fasilitas: string[];
  maxPenghuni: number;
  gambar?: string[];
  gambarProfil?: number;
  payments?: Payment[];
}
```

### 2. Penghuni Data

```typescript
interface Penghuni {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  tanggalMasuk: string; // ISO date string
}
```

### 3. Payment Data

```typescript
interface Payment {
  id: string;
  bulan: string;  // e.g., "Januari", "Februari"
  tahun: number;
  jumlah: number;
  status: 'lunas' | 'sudah_bayar' | 'belum_bayar' | 'terlambat';
  tanggalBayar?: string;
  metodePembayaran?: string;
  tanggalJatuhTempo?: string;
  buktiPembayaran?: string;  // URL or file path
}
```

### 4. IoT Device Data

```typescript
interface IoTDevice {
  id: string;
  name: string;
  deviceId: string;
  status: "connected" | "disconnected" | "error";
  lastUpdate: string;  // ISO date string
  location?: string;
  daya?: number;      // Watt
  tegangan?: number;  // Volt
  arus?: number;      // Ampere
}

interface Perangkat {
  id: string;
  kamarId: string;
  nama: string;
  deviceId: string;
  dayaWatt: number;
}
```

### 5. SmartWattWise Group

```typescript
interface SmartWattWiseGroup {
  id: string;
  name: string;
  devices: string[];  // array of device IDs
  totalDaya: number;  // calculated total power
}
```

---

## 🔌 Required Backend Endpoints

### ✅ Already Implemented (No Changes Needed)

#### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/change-password`

#### OTP
- `POST /api/otp/request`
- `POST /api/otp/verify`
- `POST /api/otp/resend`
- `GET /api/otp/status/:email/:purpose`

#### Sensor Data
- `GET /api/sensor/latest`
- `GET /api/sensor/history`

---

### 🔧 Needs Adjustment or Implementation

#### KOS Management

**1. GET /api/kos**
- Get all kos owned by current user
- Response must match `Kos[]` structure
- Include nested `kamarList` with full `Kamar` data

**2. POST /api/kos**
- Create new kos
- Request body:
```json
{
  "nama": "Kos Melati",
  "alamat": "Jl. Melati No. 123, Bandung",
  "hargaMin": 500000,
  "hargaMax": 1500000,
  "fasilitas": ["WiFi", "Kamar Mandi Dalam", "AC"],
  "gambar": ["url1.jpg", "url2.jpg"]
}
```

**3. GET /api/kos/:kosId**
- Get single kos with full kamarList
- Include nested penghuni and payments data

**4. PUT /api/kos/:kosId**
- Update kos details
- Allow updating: nama, alamat, fasilitas, gambar

**5. DELETE /api/kos/:kosId**
- Delete kos (only if no active tenants)

---

#### KAMAR (Room) Management

**1. POST /api/kos/:kosId/kamar**
- Add new room to kos
- Request body:
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

**2. PUT /api/kos/:kosId/kamar/:kamarId**
- Update room details
- Allow updating: nama, hargaSewa, luasKamar, fasilitas, maxPenghuni, gambar, status

**3. DELETE /api/kos/:kosId/kamar/:kamarId**
- Delete room (only if status = 'kosong')

**4. GET /api/kos/:kosId/kamar/:kamarId**
- Get detailed room info
- Include: penghuniList[], payments[]

---

#### PENGHUNI (Tenant) Management

**1. POST /api/kos/:kosId/kamar/:kamarId/penghuni**
- Add tenant to room
- Request body:
```json
{
  "nama": "Ahmad Rizki",
  "email": "ahmad@example.com",
  "telepon": "08123456789",
  "tanggalMasuk": "2026-01-15"
}
```
- Auto-update kamar.status to 'terisi'

**2. DELETE /api/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId**
- Remove tenant from room
- Auto-update kamar.status to 'kosong' if penghuniList empty

**3. PUT /api/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId**
- Update tenant info

---

#### PAYMENTS Management

**1. GET /api/kos/:kosId/kamar/:kamarId/payments**
- Get all payments for a room

**2. POST /api/kos/:kosId/kamar/:kamarId/payments**
- Create payment record
- Request body:
```json
{
  "bulan": "Januari",
  "tahun": 2026,
  "jumlah": 800000,
  "tanggalJatuhTempo": "2026-01-10",
  "status": "belum_bayar"
}
```

**3. PUT /api/kos/:kosId/kamar/:kamarId/payments/:paymentId**
- Update payment status
- Allow updating: status, tanggalBayar, metodePembayaran, buktiPembayaran

**4. POST /api/kos/:kosId/kamar/:kamarId/payments/:paymentId/confirm**
- Confirm payment (change status to 'sudah_bayar' or 'lunas')
- Upload buktiPembayaran

---

#### DEVICE Management

**1. GET /api/devices**
- Get all IoT devices for current user
- Response must match `IoTDevice[]` structure

**2. POST /api/devices**
- Register new device
- Request body:
```json
{
  "name": "PZEM-001",
  "deviceId": "FC24-0041",
  "location": "Kamar 101"
}
```

**3. PUT /api/devices/:deviceId**
- Update device info
- Allow updating: name, location

**4. DELETE /api/devices/:deviceId**
- Delete device

**5. GET /api/devices/:deviceId/realtime**
- Get real-time data for specific device
- Response:
```json
{
  "success": true,
  "data": {
    "deviceId": "FC24-0041",
    "voltage": 220.5,
    "current": 1.2,
    "power": 264.6,
    "energy": 12.5,
    "frequency": 50.1,
    "powerFactor": 0.95,
    "timestamp": "2026-11-03T10:30:00Z"
  }
}
```

---

#### PERANGKAT (Electrical Devices) Management

**1. GET /api/perangkat**
- Get all electrical devices for current user
- Response must match `Perangkat[]` structure

**2. POST /api/perangkat**
- Add electrical device to room
- Request body:
```json
{
  "kamarId": "kamar-123",
  "nama": "AC 1 PK",
  "deviceId": "FC24-0041",
  "dayaWatt": 750
}
```

**3. DELETE /api/perangkat/:perangkatId**
- Remove electrical device

---

#### GROUPS Management

**1. GET /api/groups**
- Get all device groups
- Response must match `SmartWattWiseGroup[]` structure

**2. POST /api/groups**
- Create device group
- Request body:
```json
{
  "name": "Kamar Lantai 1",
  "devices": ["device-1", "device-2"]
}
```
- Auto-calculate totalDaya from devices

**3. PUT /api/groups/:groupId**
- Update group (add/remove devices)

**4. DELETE /api/groups/:groupId**
- Delete group

---

#### FINANCIAL REPORTS

**1. GET /api/finance/summary**
- Get financial summary
- Query params: `year`, `month` (optional)
- Response:
```json
{
  "success": true,
  "data": {
    "totalPendapatan": 15000000,
    "totalTunggakan": 2400000,
    "pembayaranBulanIni": 8,
    "persentasePembayaran": 76.9,
    "detailPerKos": [...]
  }
}
```

**2. GET /api/finance/report**
- Generate financial report
- Query params: `kosId`, `startDate`, `endDate`

---

## 🔐 Authorization Rules

### User Roles
- **owner**: Can manage their own kos, rooms, tenants
- **penghuni**: Can view their own room, payments, devices
- **admin**: Can manage all kos

### Middleware Implementation

```javascript
// Example: Protect kos endpoints
router.get('/api/kos', protect, getKosList);
router.post('/api/kos', protect, authorize('owner', 'admin'), createKos);

// Ensure user owns the kos before modification
const checkKosOwnership = async (req, res, next) => {
  const kos = await Kos.findById(req.params.kosId);
  if (kos.ownerId.toString() !== req.user.id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Anda tidak memiliki akses ke kos ini'
    });
  }
  req.kos = kos;
  next();
};
```

---

## 📝 Response Format Standards

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message in Indonesian",
  "error": "Technical error details (optional, only in dev)"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

## 🗄️ Database Schema Updates Needed

### Kos Model (Update)
```javascript
const KosSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  alamat: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jumlahKamar: { type: Number, default: 0 },  // auto-calculated
  kamarTerisi: { type: Number, default: 0 },  // auto-calculated
  hargaMin: { type: Number },  // auto-calculated from rooms
  hargaMax: { type: Number },  // auto-calculated from rooms
  fasilitas: [{ type: String }],
  gambar: [{ type: String }],
  gambarProfil: { type: Number, default: 0 },
}, { timestamps: true });
```

### Kamar Model (Update)
```javascript
const KamarSchema = new mongoose.Schema({
  kosId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kos', required: true },
  nama: { type: String, required: true },
  status: { type: String, enum: ['terisi', 'kosong'], default: 'kosong' },
  hargaSewa: { type: Number, required: true },
  luasKamar: { type: Number, required: true },
  fasilitas: [{ type: String }],
  maxPenghuni: { type: Number, default: 1 },
  gambar: [{ type: String }],
  gambarProfil: { type: Number, default: 0 },
}, { timestamps: true });
```

### Payment Model (New)
```javascript
const PaymentSchema = new mongoose.Schema({
  kamarId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kamar', required: true },
  penghuniId: { type: mongoose.Schema.Types.ObjectId, ref: 'Penghuni' },
  bulan: { type: String, required: true },  // "Januari", "Februari", etc.
  tahun: { type: Number, required: true },
  jumlah: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['lunas', 'sudah_bayar', 'belum_bayar', 'terlambat'],
    default: 'belum_bayar'
  },
  tanggalBayar: { type: Date },
  metodePembayaran: { type: String },  // "Transfer", "Cash", "E-wallet"
  tanggalJatuhTempo: { type: Date },
  buktiPembayaran: { type: String },  // URL or file path
}, { timestamps: true });
```

### Perangkat Model (New)
```javascript
const PerangkatSchema = new mongoose.Schema({
  kamarId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kamar', required: true },
  nama: { type: String, required: true },
  deviceId: { type: String, required: true },  // Link to Device collection
  dayaWatt: { type: Number, required: true },
}, { timestamps: true });
```

### Group Model (New)
```javascript
const GroupSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  devices: [{ type: String }],  // Array of deviceIds
  totalDaya: { type: Number, default: 0 },  // auto-calculated
}, { timestamps: true });
```

---

## 🚀 Implementation Priority

### Phase 1: Core KOS Management (REQUIRED)
1. ✅ Update Kos model
2. ✅ Update Kamar model (Room)
3. ✅ Implement Kos CRUD endpoints
4. ✅ Implement Kamar CRUD endpoints
5. ✅ Test with Postman/cURL

### Phase 2: Tenant & Payment (HIGH PRIORITY)
1. ✅ Create Payment model
2. ✅ Implement Penghuni endpoints
3. ✅ Implement Payment endpoints
4. ✅ Add ownership checks

### Phase 3: Device Integration (MEDIUM PRIORITY)
1. ✅ Create Perangkat model
2. ✅ Implement Perangkat endpoints
3. ✅ Link devices to rooms

### Phase 4: Groups & Analytics (LOW PRIORITY)
1. ✅ Create Group model
2. ✅ Implement Group endpoints
3. ✅ Financial reports

---

## 📖 Usage Example

### Frontend Integration (Future)

```typescript
// After backend is ready, frontend will call like this:
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// Get all kos
const response = await apiClient.get('/kos');
const kosList: Kos[] = response.data.data;

// Add room to kos
await apiClient.post(`/kos/${kosId}/kamar`, {
  nama: "Kamar 101",
  hargaSewa: 800000,
  luasKamar: 12,
  fasilitas: ["AC", "Kasur"],
  maxPenghuni: 2
});
```

---

## ✅ Checklist

### Backend Tasks
- [ ] Update Kos model schema
- [ ] Update Kamar model schema
- [ ] Create Payment model
- [ ] Create Perangkat model
- [ ] Create Group model
- [ ] Implement Kos endpoints
- [ ] Implement Kamar endpoints
- [ ] Implement Penghuni endpoints
- [ ] Implement Payment endpoints
- [ ] Implement Perangkat endpoints
- [ ] Implement Group endpoints
- [ ] Implement Financial reports
- [ ] Add ownership authorization
- [ ] Test all endpoints
- [ ] Update API_DOCUMENTATION.md

### Frontend Tasks (Later - DO NOT MODIFY NOW)
- [ ] Create axios client
- [ ] Create service layer
- [ ] Replace localStorage with API calls
- [ ] Add loading states
- [ ] Add error handling
- [ ] Update AppContext to use API

---

## 📞 Notes

1. **DO NOT modify frontend** - Only adjust backend to match frontend expectations
2. All dates should be ISO 8601 format
3. All IDs should be string (convert MongoDB ObjectId to string)
4. Use Indonesian messages for user-facing errors
5. Validate all inputs before saving to DB
6. Auto-calculate derived fields (jumlahKamar, kamarTerisi, hargaMin, hargaMax, totalDaya)
7. Implement soft delete where appropriate
8. Add indexes for frequently queried fields (ownerId, kosId, kamarId)

---

**Generated**: 2026-11-03
**Status**: Ready for implementation
