# 🔌 Web2 Backend Integration - Complete Guide

## 📋 Overview

Backend API telah diimplementasikan untuk mendukung **frontend web2** tanpa mengubah kode frontend sama sekali. Backend menyesuaikan format data dan endpoint sesuai dengan ekspektasi frontend.

---

## ✅ What Has Been Implemented

### 🗄️ Database Models (New)

1. **Payment Model** (`backend/src/models/Payment.js`)
   - Mengelola pembayaran sewa per kamar
   - Status: lunas, sudah_bayar, belum_bayar, terlambat
   - Auto-update status based on tanggalJatuhTempo

2. **Perangkat Model** (`backend/src/models/Perangkat.js`)
   - Mengelola electrical devices per kamar
   - Link ke IoT devices melalui deviceId

3. **Group Model** (`backend/src/models/Group.js`)
   - Mengelola device groups
   - Auto-calculate totalDaya

### 🔄 Data Transformers

**File:** `backend/src/utils/transformers.js`

Utility functions untuk mengubah format MongoDB documents ke format yang diharapkan frontend:

- `transformKosToFrontend()` - Kos → Frontend Kos interface
- `transformKamarToFrontend()` - Room → Frontend Kamar interface
- `transformPenghuniToFrontend()` - Penghuni model transformation
- `transformPaymentToFrontend()` - Payment model transformation
- `transformDeviceToFrontend()` - Device → IoTDevice transformation
- `transformPerangkatToFrontend()` - Perangkat transformation
- `transformGroupToFrontend()` - Group transformation

### 🎮 Controllers (Web2-specific)

1. **kosControllerWeb2.js** - 5 endpoints
   - GET /api/web2/kos
   - GET /api/web2/kos/:kosId
   - POST /api/web2/kos
   - PUT /api/web2/kos/:kosId
   - DELETE /api/web2/kos/:kosId

2. **kamarControllerWeb2.js** - 4 endpoints
   - GET /api/web2/kos/:kosId/kamar/:kamarId
   - POST /api/web2/kos/:kosId/kamar
   - PUT /api/web2/kos/:kosId/kamar/:kamarId
   - DELETE /api/web2/kos/:kosId/kamar/:kamarId

3. **penghuniControllerWeb2.js** - 3 endpoints
   - POST /api/web2/kos/:kosId/kamar/:kamarId/penghuni
   - PUT /api/web2/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId
   - DELETE /api/web2/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId

4. **paymentControllerWeb2.js** - 4 endpoints
   - GET /api/web2/kos/:kosId/kamar/:kamarId/payments
   - POST /api/web2/kos/:kosId/kamar/:kamarId/payments
   - PUT /api/web2/kos/:kosId/kamar/:kamarId/payments/:paymentId
   - POST /api/web2/kos/:kosId/kamar/:kamarId/payments/:paymentId/confirm

### 🛣️ Routes

**File:** `backend/src/routes/web2Routes.js`

All web2 endpoints registered under `/api/web2` prefix.

**Registered in:** `backend/src/app.js`

---

## 📁 File Structure

```
wattwise/
├── backend/
│   └── src/
│       ├── models/
│       │   ├── Kos.js (existing, used as-is)
│       │   ├── Room.js (existing, used as-is)
│       │   ├── Penghuni.js (existing, used as-is)
│       │   ├── Payment.js ✨ NEW
│       │   ├── Perangkat.js ✨ NEW
│       │   └── Group.js ✨ NEW
│       ├── controllers/
│       │   ├── kosControllerWeb2.js ✨ NEW
│       │   ├── kamarControllerWeb2.js ✨ NEW
│       │   ├── penghuniControllerWeb2.js ✨ NEW
│       │   └── paymentControllerWeb2.js ✨ NEW
│       ├── routes/
│       │   └── web2Routes.js ✨ NEW
│       ├── utils/
│       │   └── transformers.js ✨ NEW
│       └── app.js (modified to register web2Routes)
│
├── web2/ (frontend - NOT MODIFIED ✅)
│
├── API_WEB2_DOCUMENTATION.md ✨ NEW
├── BACKEND_API_FOR_WEB2_INTEGRATION.md ✨ NEW
├── BACKEND_IMPLEMENTATION_SUMMARY.md ✨ NEW
└── WEB2_BACKEND_INTEGRATION_README.md ✨ NEW (this file)
```

---

## 🚀 How to Use

### 1. Start Backend Server

```bash
cd backend
npm install  # if not already done
npm start
```

Backend will run on `http://localhost:5000`

### 2. Test Endpoints

Use Postman or cURL to test endpoints.

**Example: Get all kos**

```bash
# Login first
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123456"}'

# Copy token from response
TOKEN="your-jwt-token-here"

# Get all kos
curl -X GET http://localhost:5000/api/web2/kos \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Frontend Integration (When Ready)

Frontend akan menggunakan endpoint `/api/web2/*` dengan format data yang sudah disesuaikan.

**Example frontend code (future):**

```typescript
// src/services/kosService.ts
import apiClient from './apiClient';

export const getKosList = async () => {
  const response = await apiClient.get('/web2/kos');
  return response.data.data; // Already in Kos[] format
};

export const createKos = async (kosData) => {
  const response = await apiClient.post('/web2/kos', kosData);
  return response.data.data;
};
```

---

## 📊 Implementation Progress

### ✅ Phase 1 & 2 Completed (60%)

**Core Features:**
- ✅ Kos Management (5 endpoints)
- ✅ Kamar Management (4 endpoints)
- ✅ Penghuni Management (3 endpoints)
- ✅ Payment Management (4 endpoints)

**Total:** 16 endpoints implemented

### 🚧 Phase 3 & 4 TODO (40%)

**Remaining Features:**
- ⏳ Device Management (5 endpoints)
- ⏳ Perangkat Management (3 endpoints)
- ⏳ Group Management (4 endpoints)
- ⏳ Financial Reports (2 endpoints)

**Total:** 14 endpoints remaining

---

## 🔍 Key Features

### 1. **No Frontend Changes**
Backend menyesuaikan dengan frontend expectations, bukan sebaliknya.

### 2. **Data Format Compatibility**
Transformers ensure semua response match dengan TypeScript interfaces di frontend.

### 3. **Automatic Calculations**
- `jumlahKamar`, `kamarTerisi` auto-calculated from Room count
- `hargaMin`, `hargaMax` auto-calculated from kamarList
- `totalDaya` auto-calculated from devices

### 4. **Ownership Checks**
All endpoints verify user owns the resource (kos, kamar, etc.)

### 5. **Auto-Status Updates**
- Kamar status auto-update to 'terisi'/'kosong' based on penghuni
- Payment status auto-update to 'terlambat' if past due date
- Kos statistics auto-update on kamar changes

### 6. **Soft Deletes**
Kos uses soft delete (status='nonaktif') instead of hard delete.

---

## 📚 Documentation Files

1. **API_WEB2_DOCUMENTATION.md**
   - Complete API reference
   - Request/response examples
   - Error handling

2. **BACKEND_API_FOR_WEB2_INTEGRATION.md**
   - Integration strategy
   - Data structure mapping
   - Implementation requirements

3. **BACKEND_IMPLEMENTATION_SUMMARY.md**
   - What's completed
   - What's TODO
   - Testing checklist

4. **WEB2_BACKEND_INTEGRATION_README.md** (this file)
   - Quick start guide
   - File structure
   - Usage examples

---

## 🧪 Testing

### Recommended Testing Flow

1. **Authentication**
   ```bash
   POST /api/auth/login
   ```

2. **Create Kos**
   ```bash
   POST /api/web2/kos
   ```

3. **Add Kamar to Kos**
   ```bash
   POST /api/web2/kos/:kosId/kamar
   ```

4. **Add Penghuni to Kamar**
   ```bash
   POST /api/web2/kos/:kosId/kamar/:kamarId/penghuni
   ```

5. **Create Payment**
   ```bash
   POST /api/web2/kos/:kosId/kamar/:kamarId/payments
   ```

6. **Verify Data**
   ```bash
   GET /api/web2/kos/:kosId
   ```

Check that:
- ✅ kamarList includes the new kamar
- ✅ penghuniList includes the new penghuni
- ✅ payments includes the new payment
- ✅ kamar.status = 'terisi'
- ✅ kos.jumlahKamar and kamarTerisi updated

---

## ⚠️ Important Notes

### 1. Frontend Tidak Diubah
Semua perubahan hanya di backend. Frontend web2 tetap menggunakan localStorage untuk sementara.

### 2. API Prefix
Web2 endpoints use `/api/web2/*` prefix to avoid conflicts with existing APIs.

### 3. Ownership Validation
All endpoints automatically check `ownerId` matches `req.user.id`.

### 4. Error Messages
All error messages in Indonesian for user-facing errors.

### 5. Date Formats
- Database: MongoDB Date objects
- API Response: ISO 8601 strings (YYYY-MM-DDTHH:mm:ss.sssZ)
- Payment dates: YYYY-MM-DD format

---

## 🔐 Security

### Authentication
- JWT token required for all endpoints
- Token verification via `protect` middleware

### Authorization
- Ownership checks in all controllers
- Role-based access via `authorize` middleware
- Only owner can modify their own resources

### Input Validation
- Required fields validation
- Data type validation
- Duplicate prevention (email, payment period)

---

## 🎯 Next Steps

### For Backend Development

1. **Implement Phase 3:**
   - Device Management controller
   - Perangkat Management controller

2. **Implement Phase 4:**
   - Group Management controller
   - Financial Reports controller

3. **Testing:**
   - Write unit tests
   - Integration tests
   - Postman collection

### For Frontend Integration (Later)

1. **Setup API Client:**
   ```bash
   cd web2/wattwise
   npm install axios
   ```

2. **Create Service Layer:**
   - `src/services/kosService.ts`
   - `src/services/kamarService.ts`
   - `src/services/penghuniService.ts`
   - `src/services/paymentService.ts`

3. **Replace LocalStorage:**
   - Update AppContext to use API calls
   - Remove mock data dependencies

4. **Add Loading States:**
   - Implement loading indicators
   - Error boundaries

---

## 📞 Support

Jika ada pertanyaan atau issue:

1. Check **API_WEB2_DOCUMENTATION.md** for endpoint details
2. Check **BACKEND_IMPLEMENTATION_SUMMARY.md** for status
3. Review transformer functions in `backend/src/utils/transformers.js`
4. Test endpoints with Postman using examples in documentation

---

## ✨ Summary

✅ **Backend siap untuk web2 integration**  
✅ **16 endpoints implemented (Phase 1 & 2)**  
✅ **No frontend changes required**  
✅ **Data format fully compatible**  
⏳ **Phase 3 & 4 can be implemented next**

**Status:** Ready for testing and frontend integration! 🚀

---

**Last Updated:** 2026-11-03  
**Implementation Progress:** 60%  
**Next Milestone:** Phase 3 Implementation
