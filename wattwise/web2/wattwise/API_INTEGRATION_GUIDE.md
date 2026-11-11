# 🔌 API Integration Guide - Frontend Web2

## 📋 Overview

Frontend sekarang sudah dilengkapi dengan **service layer** untuk memanggil backend API. Implementasi dilakukan **tanpa mengubah kode yang sudah ada**, hanya menambahkan file baru.

---

## ✅ What Has Been Added

### 1. **Service Layer** (`src/services/`)

#### `apiClient.ts`
- Axios instance dengan base URL dari `.env`
- Request interceptor: Auto-add JWT token
- Response interceptor: Handle errors, auto-logout on 401
- Helper functions: `setAuthToken()`, `getAuthToken()`, `clearAuthToken()`

#### `authService.ts`
- `register()` - Register user
- `login()` - Login user
- `logout()` - Logout user (clear tokens)
- `getProfile()` - Get current user profile
- `changePassword()` - Change password
- `isAuthenticated()` - Check auth status
- `getCurrentUser()` - Get user from localStorage

#### `kosService.ts`
Complete KOS management API calls:

**Kos Operations:**
- `getKosList()` - Get all kos
- `getKosById(kosId)` - Get single kos
- `createKos(data)` - Create new kos
- `updateKos(kosId, data)` - Update kos
- `deleteKos(kosId)` - Delete kos

**Kamar Operations:**
- `addKamar(kosId, data)` - Add room to kos
- `updateKamar(kosId, kamarId, data)` - Update room
- `deleteKamar(kosId, kamarId)` - Delete room

**Penghuni Operations:**
- `addPenghuni(kosId, kamarId, data)` - Add tenant
- `updatePenghuni(kosId, kamarId, penghuniId, data)` - Update tenant
- `removePenghuni(kosId, kamarId, penghuniId)` - Remove tenant

**Payment Operations:**
- `getPayments(kosId, kamarId, filters)` - Get payments
- `createPayment(kosId, kamarId, data)` - Create payment
- `updatePayment(kosId, kamarId, paymentId, data)` - Update payment
- `confirmPayment(kosId, kamarId, paymentId, data)` - Confirm payment

### 2. **Custom Hooks** (`src/hooks/`)

#### `useKosData.ts`
React hooks untuk fetch data dengan loading/error states:

- `useKosData()` - Fetch & manage kos list
  - Returns: `{ kosList, loading, error, refetch, addKos, updateKos, deleteKos, ... }`

- `useKosDetail(kosId)` - Fetch single kos with details
  - Returns: `{ kos, loading, error, refetch }`

- `usePayments(kosId, kamarId)` - Fetch & manage payments
  - Returns: `{ payments, loading, error, refetch, createPayment, updatePayment, confirmPayment }`

#### `useKosManagementAPI.ts`
Drop-in replacement untuk existing `useKosManagement()` hook:

- Same interface as existing hook
- Toggle-able dengan environment variable
- Supports both API and localStorage modes

### 3. **Service Exports** (`src/services/index.ts`)

```typescript
export { 
  apiClient, 
  setAuthToken, 
  getAuthToken, 
  clearAuthToken,
  authService,
  kosService
};
```

---

## 🚀 How to Use

### Option 1: Direct Service Calls (Recommended for new code)

```typescript
// In your component
import { kosService } from '../services';

function MyComponent() {
  const [kosList, setKosList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await kosService.getKosList();
        setKosList(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return <div>...</div>;
}
```

### Option 2: Using Custom Hooks (Easier)

```typescript
// In your component
import { useKosData } from '../hooks/useKosData';

function MyComponent() {
  const { 
    kosList, 
    loading, 
    error, 
    addKos, 
    updateKos, 
    deleteKos 
  } = useKosData();

  const handleAddKos = async () => {
    try {
      await addKos({
        nama: 'Kos Melati',
        alamat: 'Jl. Melati No. 123, Bandung',
        fasilitas: ['WiFi', 'AC']
      });
      alert('Kos berhasil ditambahkan!');
    } catch (error) {
      alert('Gagal menambahkan kos');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={handleAddKos}>Add Kos</button>
      {kosList.map(kos => (
        <div key={kos.id}>{kos.nama}</div>
      ))}
    </div>
  );
}
```

### Option 3: Toggle API Mode (For gradual migration)

Set environment variable in `.env`:

```bash
# Use API backend
REACT_APP_USE_API=true

# Use localStorage (existing behavior)
REACT_APP_USE_API=false
```

Then use the API-aware hook:

```typescript
import { useKosManagementAPI } from '../hooks/context/useKosManagementAPI';

function MyComponent() {
  const { kosList, addKos, updateKos } = useKosManagementAPI();
  
  // Works with both API and localStorage automatically!
  // No code changes needed
}
```

---

## 🔐 Authentication Flow

### 1. Login

```typescript
import { authService } from '../services';

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authService.login({ email, password });
    
    if (response.success) {
      // Token & user automatically saved to localStorage
      console.log('User:', response.data.user);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  } catch (error) {
    console.error('Login failed:', error);
    alert(error.message);
  }
};
```

### 2. Logout

```typescript
import { authService } from '../services';

const handleLogout = () => {
  authService.logout(); // Clears token & user
  window.location.href = '/login';
};
```

### 3. Get Current User

```typescript
import { authService } from '../services';

const user = authService.getCurrentUser();
console.log('Current user:', user);

// Or fetch from API
const fetchProfile = async () => {
  try {
    const response = await authService.getProfile();
    console.log('Profile:', response.data);
  } catch (error) {
    console.error('Not authenticated');
  }
};
```

### 4. Protected Routes

Token is automatically added to all API requests via interceptor.

If token is invalid/expired, user is auto-redirected to login (401 handler).

---

## 📝 Example Usage: Complete CRUD

### Create Kos

```typescript
import { kosService } from '../services';

const handleCreateKos = async () => {
  try {
    const newKos = await kosService.createKos({
      nama: 'Kos Melati',
      alamat: 'Jl. Melati No. 123, Kelurahan ABC, Kecamatan XYZ, Bandung, Jawa Barat, 40123',
      fasilitas: ['WiFi', 'Kamar Mandi Dalam', 'AC'],
      gambar: ['url1.jpg', 'url2.jpg']
    });
    
    console.log('New kos:', newKos);
    alert('Kos berhasil dibuat!');
  } catch (error) {
    alert('Gagal membuat kos: ' + error.message);
  }
};
```

### Add Room to Kos

```typescript
import { kosService } from '../services';

const handleAddKamar = async (kosId: string) => {
  try {
    const newKamar = await kosService.addKamar(kosId, {
      nama: 'Kamar 101',
      hargaSewa: 800000,
      luasKamar: 12,
      fasilitas: ['AC', 'Kasur', 'Lemari'],
      maxPenghuni: 2,
      gambar: []
    });
    
    console.log('New kamar:', newKamar);
    alert('Kamar berhasil ditambahkan!');
  } catch (error) {
    alert('Gagal menambahkan kamar: ' + error.message);
  }
};
```

### Add Tenant to Room

```typescript
import { kosService } from '../services';

const handleAddPenghuni = async (kosId: string, kamarId: string) => {
  try {
    const newPenghuni = await kosService.addPenghuni(kosId, kamarId, {
      nama: 'Ahmad Rizki',
      email: 'ahmad@example.com',
      telepon: '08123456789',
      tanggalMasuk: '2026-01-15'
    });
    
    console.log('New penghuni:', newPenghuni);
    alert('Penghuni berhasil ditambahkan!');
    // Kamar status auto-updated to 'terisi' by backend
  } catch (error) {
    alert('Gagal menambahkan penghuni: ' + error.message);
  }
};
```

### Create Payment

```typescript
import { kosService } from '../services';

const handleCreatePayment = async (kosId: string, kamarId: string) => {
  try {
    const newPayment = await kosService.createPayment(kosId, kamarId, {
      bulan: 'Januari',
      tahun: 2026,
      jumlah: 800000,
      tanggalJatuhTempo: '2026-01-05',
      keterangan: 'Pembayaran sewa bulan Januari'
    });
    
    console.log('New payment:', newPayment);
    alert('Pembayaran berhasil dibuat!');
  } catch (error) {
    alert('Gagal membuat pembayaran: ' + error.message);
  }
};
```

### Confirm Payment

```typescript
import { kosService } from '../services';

const handleConfirmPayment = async (kosId: string, kamarId: string, paymentId: string) => {
  try {
    const confirmedPayment = await kosService.confirmPayment(kosId, kamarId, paymentId, {
      metodePembayaran: 'Transfer Bank',
      buktiPembayaran: 'https://example.com/bukti.jpg'
    });
    
    console.log('Confirmed payment:', confirmedPayment);
    alert('Pembayaran berhasil dikonfirmasi!');
    // Status auto-changed to 'sudah_bayar' by backend
  } catch (error) {
    alert('Gagal konfirmasi pembayaran: ' + error.message);
  }
};
```

---

## ⚙️ Configuration

### Environment Variables (`.env`)

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Toggle API mode (optional)
REACT_APP_USE_API=true

# Other existing variables...
REACT_APP_NAME=WattWise
REACT_APP_VERSION=1.0.0
```

### Backend URL

- **Development:** `http://localhost:5000/api`
- **Production:** Update to your deployed backend URL

---

## 🐛 Error Handling

### API Errors

All errors are caught and returned with structure:

```typescript
{
  success: false,
  message: 'Error message in Indonesian',
  error: 'Technical details (optional)'
}
```

### Handle Errors in Components

```typescript
try {
  await kosService.createKos(data);
} catch (error: any) {
  if (error.message) {
    alert(error.message); // User-friendly message
  } else {
    alert('Terjadi kesalahan');
  }
  console.error('Technical error:', error);
}
```

### Global Error Handler

Axios interceptor handles:
- **401 Unauthorized**: Auto-logout & redirect to login
- **403 Forbidden**: Log error
- **Network errors**: Show connection error message

---

## 🔄 Migration Strategy

### Phase 1: Side-by-side (Current)
- ✅ API services available
- ✅ Existing localStorage code untouched
- ✅ Developers can use API or localStorage
- Toggle with `REACT_APP_USE_API` env var

### Phase 2: Gradual Migration (Recommended)
1. Start with new features → use API services directly
2. Update critical pages one by one → replace hooks
3. Test thoroughly after each page
4. Keep localStorage as fallback

### Phase 3: Full Migration
1. Replace all `useKosManagement()` with `useKosManagementAPI()`
2. Set `REACT_APP_USE_API=true` globally
3. Remove localStorage code
4. Remove fallback logic

---

## ✅ Testing Checklist

Before deploying API integration:

- [ ] Backend running at `http://localhost:5000`
- [ ] Can login and get JWT token
- [ ] Can fetch kos list
- [ ] Can create new kos
- [ ] Can add kamar to kos
- [ ] Can add penghuni to kamar
- [ ] Can create payments
- [ ] Can confirm payments
- [ ] Loading states work correctly
- [ ] Error messages display properly
- [ ] Auto-logout on 401 works
- [ ] All CRUD operations refresh UI correctly

---

## 📚 Related Documentation

- **Backend API Docs:** `backend/API_WEB2_DOCUMENTATION.md`
- **Backend Implementation:** `BACKEND_IMPLEMENTATION_SUMMARY.md`
- **Integration Plan:** `BACKEND_API_FOR_WEB2_INTEGRATION.md`

---

## 🎯 Next Steps

### Immediate
1. ✅ Test API services with Postman
2. ✅ Test `useKosData` hooks in components
3. ✅ Verify authentication flow

### Short-term
1. Update key pages to use API
   - Dashboard (kos list)
   - Kamar detail page
   - Penghuni management
   - Payment management
2. Add loading indicators
3. Add error boundaries

### Long-term
1. Complete migration from localStorage
2. Add offline support (service worker + cache)
3. Add real-time updates (WebSocket)
4. Implement optimistic UI updates

---

**Status:** ✅ API Integration Ready  
**Mode:** Side-by-side (backward compatible)  
**Last Updated:** 2026-11-03
