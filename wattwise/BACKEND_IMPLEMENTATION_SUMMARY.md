# Backend Implementation Summary for Web2 Integration

## ✅ Completed Tasks

### 1. **New Database Models Created**

#### Payment Model (`src/models/Payment.js`)
- Fields: kamarId, penghuniId, bulan, tahun, jumlah, status, tanggalBayar, metodePembayaran, tanggalJatuhTempo, buktiPembayaran
- Status enum: lunas, sudah_bayar, belum_bayar, terlambat
- Auto-update status to 'terlambat' if past due date
- Virtual field: isLate
- Indexed by: kamarId, penghuniId, status, tanggalJatuhTempo

#### Perangkat Model (`src/models/Perangkat.js`)
- Fields: kamarId, nama, deviceId, dayaWatt, jenis, statusOperasi, keterangan
- Links electrical devices to rooms
- Virtual reference to Device model
- Indexed by: kamarId, deviceId

#### Group Model (`src/models/Group.js`)
- Fields: ownerId, name, devices (array), totalDaya, deskripsi
- Auto-calculate totalDaya from Perangkat devices
- Method: calculateTotalDaya()
- Virtual: deviceCount
- Indexed by: ownerId, name

### 2. **Data Transformers Utility** (`src/utils/transformers.js`)

Created utility functions to transform MongoDB documents to frontend-expected formats:

- `transformKosToFrontend(kos, kamarList)` - Converts Kos model to frontend Kos interface
  - Flattens alamat object to string
  - Calculates hargaMin/hargaMax from kamarList
  - Converts _id to string
  
- `transformKamarToFrontend(kamar, penghuniList, payments)` - Converts Room to Kamar
  - Includes nested penghuniList and payments arrays
  
- `transformPenghuniToFrontend(penghuni)` - Converts Penghuni model
  - Maps no_telp to telepon
  - Formats tanggalMasuk as ISO string
  
- `transformPaymentToFrontend(payment)` - Converts Payment model
  - Formats dates as ISO strings
  - Includes all payment details
  
- `transformDeviceToFrontend(device, sensorData)` - Converts Device to IoTDevice
  - Merges device info with latest sensor data
  - Maps fields to frontend expectations
  
- `transformPerangkatToFrontend(perangkat)` - Simple Perangkat conversion

- `transformGroupToFrontend(group)` - Simple Group conversion

- `transformUserToFrontend(user)` - Maps User to frontend format

**Key Principle**: Backend adjusts to frontend, frontend NEVER changes.

### 3. **New Controllers for Web2**

#### Kos Controller Web2 (`src/controllers/kosControllerWeb2.js`)

✅ Implemented Endpoints:

1. **GET /api/web2/kos**
   - Get all kos owned by current user
   - Includes nested kamarList with basic info
   - Auto-calculates jumlahKamar, kamarTerisi
   - Response format matches frontend `Kos[]`

2. **GET /api/web2/kos/:kosId**
   - Get single kos with full details
   - Includes kamarList with penghuniList and payments
   - Deep nesting for complete data

3. **POST /api/web2/kos**
   - Create new kos
   - Parses alamat string to alamat object
   - Auto-sets ownerId from req.user
   - Returns transformed Kos object

4. **PUT /api/web2/kos/:kosId**
   - Update kos details
   - Allows updating: nama, alamat, fasilitas, gambar, gambarProfil
   - Ownership check included

5. **DELETE /api/web2/kos/:kosId**
   - Soft delete (sets status to 'nonaktif')
   - Prevents deletion if kamarTerisi > 0
   - Ownership check included

#### Kamar Controller Web2 (`src/controllers/kamarControllerWeb2.js`)

✅ Implemented Endpoints:

1. **GET /api/web2/kos/:kosId/kamar/:kamarId**
   - Get kamar with full details
   - Includes penghuniList and payments
   - Response format matches frontend `Kamar`

2. **POST /api/web2/kos/:kosId/kamar**
   - Add new room to kos
   - Auto-updates kos statistics
   - Sets ownerId and initial status 'kosong'

3. **PUT /api/web2/kos/:kosId/kamar/:kamarId**
   - Update room details
   - Can update all fields including status
   - Triggers kos statistics update

4. **DELETE /api/web2/kos/:kosId/kamar/:kamarId**
   - Delete room (only if status='kosong')
   - Auto-updates kos statistics
   - Ownership check included

---

## 🚧 TODO: Remaining Controllers & Routes

### Phase 2: Penghuni & Payment Management

#### 1. Penghuni Controller Web2 (`src/controllers/penghuniControllerWeb2.js`)

Need to implement:

```javascript
// POST /api/web2/kos/:kosId/kamar/:kamarId/penghuni
exports.addPenghuniToKamar = async (req, res) => {
  // Add tenant to room
  // Auto-update kamar.status to 'terisi'
  // Update kos statistics
}

// PUT /api/web2/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId
exports.updatePenghuni = async (req, res) => {
  // Update tenant info
}

// DELETE /api/web2/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId
exports.removePenghuniFromKamar = async (req, res) => {
  // Remove tenant
  // Auto-update kamar.status to 'kosong' if no more penghuni
  // Update kos statistics
}
```

#### 2. Payment Controller Web2 (`src/controllers/paymentControllerWeb2.js`)

Need to implement:

```javascript
// GET /api/web2/kos/:kosId/kamar/:kamarId/payments
exports.getPaymentsByKamar = async (req, res) => {
  // Get all payments for a room
  // Sort by tahun, bulan DESC
}

// POST /api/web2/kos/:kosId/kamar/:kamarId/payments
exports.createPayment = async (req, res) => {
  // Create payment record
  // Auto-set status based on tanggalJatuhTempo
}

// PUT /api/web2/kos/:kosId/kamar/:kamarId/payments/:paymentId
exports.updatePayment = async (req, res) => {
  // Update payment status, tanggalBayar, etc.
}

// POST /api/web2/kos/:kosId/kamar/:kamarId/payments/:paymentId/confirm
exports.confirmPayment = async (req, res) => {
  // Confirm payment (upload buktiPembayaran)
  // Change status to 'sudah_bayar' or 'lunas'
}
```

### Phase 3: Device & Perangkat Management

#### 3. Device Controller Web2 (`src/controllers/deviceControllerWeb2.js`)

Need to implement:

```javascript
// GET /api/web2/devices
exports.getDevices = async (req, res) => {
  // Get all IoT devices for current user
  // Merge with latest sensor data
  // Response matches IoTDevice[] format
}

// POST /api/web2/devices
exports.registerDevice = async (req, res) => {
  // Register new device
}

// PUT /api/web2/devices/:deviceId
exports.updateDevice = async (req, res) => {
  // Update device info (name, location)
}

// DELETE /api/web2/devices/:deviceId
exports.deleteDevice = async (req, res) => {
  // Delete device
}

// GET /api/web2/devices/:deviceId/realtime
exports.getDeviceRealtime = async (req, res) => {
  // Get real-time sensor data for device
}
```

#### 4. Perangkat Controller Web2 (`src/controllers/perangkatControllerWeb2.js`)

Need to implement:

```javascript
// GET /api/web2/perangkat
exports.getPerangkatList = async (req, res) => {
  // Get all perangkat for current user
  // Response matches Perangkat[] format
}

// POST /api/web2/perangkat
exports.addPerangkat = async (req, res) => {
  // Add electrical device to room
}

// DELETE /api/web2/perangkat/:perangkatId
exports.removePerangkat = async (req, res) => {
  // Remove electrical device
}
```

### Phase 4: Groups & Financial Reports

#### 5. Group Controller Web2 (`src/controllers/groupControllerWeb2.js`)

Need to implement:

```javascript
// GET /api/web2/groups
exports.getGroups = async (req, res) => {
  // Get all device groups
  // Response matches SmartWattWiseGroup[] format
}

// POST /api/web2/groups
exports.createGroup = async (req, res) => {
  // Create device group
  // Auto-calculate totalDaya
}

// PUT /api/web2/groups/:groupId
exports.updateGroup = async (req, res) => {
  // Update group (add/remove devices)
  // Recalculate totalDaya
}

// DELETE /api/web2/groups/:groupId
exports.deleteGroup = async (req, res) => {
  // Delete group
}
```

#### 6. Finance Controller Web2 (`src/controllers/financeControllerWeb2.js`)

Need to implement:

```javascript
// GET /api/web2/finance/summary
exports.getFinancialSummary = async (req, res) => {
  // Get financial summary
  // Query params: year, month (optional)
  // Calculate totalPendapatan, totalTunggakan, etc.
}

// GET /api/web2/finance/report
exports.generateReport = async (req, res) => {
  // Generate financial report
  // Query params: kosId, startDate, endDate
}
```

---

## 🔗 Routes Setup Needed

Create new route file: `src/routes/web2Routes.js`

```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

// Import controllers
const kosController = require('../controllers/kosControllerWeb2');
const kamarController = require('../controllers/kamarControllerWeb2');
const penghuniController = require('../controllers/penghuniControllerWeb2');
const paymentController = require('../controllers/paymentControllerWeb2');
const deviceController = require('../controllers/deviceControllerWeb2');
const perangkatController = require('../controllers/perangkatControllerWeb2');
const groupController = require('../controllers/groupControllerWeb2');
const financeController = require('../controllers/financeControllerWeb2');

// ===== KOS ROUTES =====
router.get('/kos', protect, kosController.getKosList);
router.get('/kos/:kosId', protect, kosController.getKosById);
router.post('/kos', protect, kosController.createKos);
router.put('/kos/:kosId', protect, kosController.updateKos);
router.delete('/kos/:kosId', protect, kosController.deleteKos);

// ===== KAMAR ROUTES =====
router.get('/kos/:kosId/kamar/:kamarId', protect, kamarController.getKamarById);
router.post('/kos/:kosId/kamar', protect, kamarController.createKamar);
router.put('/kos/:kosId/kamar/:kamarId', protect, kamarController.updateKamar);
router.delete('/kos/:kosId/kamar/:kamarId', protect, kamarController.deleteKamar);

// ===== PENGHUNI ROUTES =====
router.post('/kos/:kosId/kamar/:kamarId/penghuni', protect, penghuniController.addPenghuniToKamar);
router.put('/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId', protect, penghuniController.updatePenghuni);
router.delete('/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId', protect, penghuniController.removePenghuniFromKamar);

// ===== PAYMENT ROUTES =====
router.get('/kos/:kosId/kamar/:kamarId/payments', protect, paymentController.getPaymentsByKamar);
router.post('/kos/:kosId/kamar/:kamarId/payments', protect, paymentController.createPayment);
router.put('/kos/:kosId/kamar/:kamarId/payments/:paymentId', protect, paymentController.updatePayment);
router.post('/kos/:kosId/kamar/:kamarId/payments/:paymentId/confirm', protect, paymentController.confirmPayment);

// ===== DEVICE ROUTES =====
router.get('/devices', protect, deviceController.getDevices);
router.post('/devices', protect, deviceController.registerDevice);
router.put('/devices/:deviceId', protect, deviceController.updateDevice);
router.delete('/devices/:deviceId', protect, deviceController.deleteDevice);
router.get('/devices/:deviceId/realtime', protect, deviceController.getDeviceRealtime);

// ===== PERANGKAT ROUTES =====
router.get('/perangkat', protect, perangkatController.getPerangkatList);
router.post('/perangkat', protect, perangkatController.addPerangkat);
router.delete('/perangkat/:perangkatId', protect, perangkatController.removePerangkat);

// ===== GROUP ROUTES =====
router.get('/groups', protect, groupController.getGroups);
router.post('/groups', protect, groupController.createGroup);
router.put('/groups/:groupId', protect, groupController.updateGroup);
router.delete('/groups/:groupId', protect, groupController.deleteGroup);

// ===== FINANCE ROUTES =====
router.get('/finance/summary', protect, financeController.getFinancialSummary);
router.get('/finance/report', protect, financeController.generateReport);

module.exports = router;
```

Then register in `src/app.js`:

```javascript
const web2Routes = require('./routes/web2Routes');

// Add this line with other routes
app.use('/api/web2', web2Routes);
```

---

## 📊 Current Status

### ✅ Completed (Phase 1)
- [x] Payment Model
- [x] Perangkat Model
- [x] Group Model
- [x] Data Transformers Utility
- [x] Kos Controller Web2 (5 endpoints)
- [x] Kamar Controller Web2 (4 endpoints)
- [x] Documentation

### 🚧 In Progress / TODO

**Phase 2 - High Priority:**
- [ ] Penghuni Controller Web2 (3 endpoints)
- [ ] Payment Controller Web2 (4 endpoints)

**Phase 3 - Medium Priority:**
- [ ] Device Controller Web2 (5 endpoints)
- [ ] Perangkat Controller Web2 (3 endpoints)

**Phase 4 - Low Priority:**
- [ ] Group Controller Web2 (4 endpoints)
- [ ] Finance Controller Web2 (2 endpoints)

**Setup:**
- [ ] Create `src/routes/web2Routes.js`
- [ ] Register routes in `src/app.js`
- [ ] Test all endpoints with Postman
- [ ] Update `API_DOCUMENTATION.md`

---

## 🧪 Testing Checklist

After implementation, test with Postman:

### Kos Management
- [ ] GET /api/web2/kos - Get all kos
- [ ] POST /api/web2/kos - Create kos
- [ ] GET /api/web2/kos/:id - Get single kos
- [ ] PUT /api/web2/kos/:id - Update kos
- [ ] DELETE /api/web2/kos/:id - Delete kos

### Kamar Management  
- [ ] GET /api/web2/kos/:kosId/kamar/:kamarId - Get kamar
- [ ] POST /api/web2/kos/:kosId/kamar - Add kamar
- [ ] PUT /api/web2/kos/:kosId/kamar/:kamarId - Update kamar
- [ ] DELETE /api/web2/kos/:kosId/kamar/:kamarId - Delete kamar

### Penghuni Management
- [ ] POST /api/web2/kos/:kosId/kamar/:kamarId/penghuni - Add penghuni
- [ ] PUT /api/web2/kos/:kosId/kamar/:kamarId/penghuni/:id - Update penghuni
- [ ] DELETE /api/web2/kos/:kosId/kamar/:kamarId/penghuni/:id - Remove penghuni

### Payment Management
- [ ] GET /api/web2/kos/:kosId/kamar/:kamarId/payments - Get payments
- [ ] POST /api/web2/kos/:kosId/kamar/:kamarId/payments - Create payment
- [ ] PUT /api/web2/kos/:kosId/kamar/:kamarId/payments/:id - Update payment
- [ ] POST /api/web2/kos/:kosId/kamar/:kamarId/payments/:id/confirm - Confirm payment

---

## 📝 Notes

1. **NO FRONTEND CHANGES** - All adjustments made on backend side only
2. **Data Format Compatibility** - Transformers ensure MongoDB documents match frontend TypeScript interfaces
3. **Ownership Checks** - All endpoints verify user owns the resource
4. **Auto-Calculations** - Statistics (jumlahKamar, kamarTerisi, totalDaya) calculated automatically
5. **Soft Deletes** - Kos uses soft delete (status='nonaktif')
6. **Authorization** - Protect middleware ensures authentication
7. **Error Handling** - Indonesian error messages for user-facing errors
8. **Indexing** - Database indexes added for frequently queried fields

---

## 🎯 Next Steps

1. ✅ Continue implementing remaining controllers (Penghuni, Payment, Device, etc.)
2. ✅ Create and register web2Routes
3. ✅ Test all endpoints thoroughly
4. ✅ Update API documentation
5. ❌ **DO NOT** modify frontend - wait for manual integration when ready

---

**Last Updated**: 2026-11-03
**Implementation Progress**: 40% (9/24 endpoints completed)
**Status**: Ready for Phase 2 implementation
