# 📝 Example: How to Use API in Components

Contoh praktis penggunaan API services dan hooks di component.

---

## Example 1: Simple Kos List Page

### Before (Using localStorage)

```typescript
// Old way - using localStorage
import { useApp } from '../context/AppContext';

function KosListPage() {
  const { kosList } = useApp();
  
  return (
    <div>
      {kosList.map(kos => (
        <div key={kos.id}>{kos.nama}</div>
      ))}
    </div>
  );
}
```

### After (Using API Hook)

```typescript
// New way - using API hook
import { useKosData } from '../hooks/useKosData';

function KosListPage() {
  const { kosList, loading, error } = useKosData();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {kosList.map(kos => (
        <div key={kos.id}>{kos.nama}</div>
      ))}
    </div>
  );
}
```

**Changes:**
- ✅ Added loading state
- ✅ Added error handling
- ✅ Data auto-fetched from API
- ✅ Auto-refresh on mount

---

## Example 2: Create Kos Form

```typescript
import { useState } from 'react';
import { useKosData } from '../hooks/useKosData';

function CreateKosForm() {
  const { addKos } = useKosData();
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    fasilitas: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await addKos(formData);
      alert('Kos berhasil dibuat!');
      
      // Reset form
      setFormData({ nama: '', alamat: '', fasilitas: [] });
    } catch (error: any) {
      alert('Gagal membuat kos: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.nama}
        onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
        placeholder="Nama Kos"
        required
      />
      
      <input
        value={formData.alamat}
        onChange={(e) => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
        placeholder="Alamat"
        required
      />
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Menyimpan...' : 'Buat Kos'}
      </button>
    </form>
  );
}
```

---

## Example 3: Kos Detail Page with Kamar

```typescript
import { useParams } from 'react-router-dom';
import { useKosDetail } from '../hooks/useKosData';
import { kosService } from '../services';

function KosDetailPage() {
  const { kosId } = useParams<{ kosId: string }>();
  const { kos, loading, error, refetch } = useKosDetail(kosId);
  const [isAddingKamar, setIsAddingKamar] = useState(false);

  const handleAddKamar = async () => {
    if (!kosId) return;
    
    try {
      setIsAddingKamar(true);
      await kosService.addKamar(kosId, {
        nama: 'Kamar 101',
        hargaSewa: 800000,
        luasKamar: 12,
        fasilitas: ['AC', 'Kasur'],
        maxPenghuni: 2
      });
      
      // Refresh data
      await refetch();
      alert('Kamar berhasil ditambahkan!');
    } catch (error: any) {
      alert('Gagal menambahkan kamar: ' + error.message);
    } finally {
      setIsAddingKamar(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!kos) return <div>Kos tidak ditemukan</div>;

  return (
    <div>
      <h1>{kos.nama}</h1>
      <p>{kos.alamat}</p>
      <p>Jumlah Kamar: {kos.jumlahKamar}</p>
      <p>Kamar Terisi: {kos.kamarTerisi}</p>
      
      <button onClick={handleAddKamar} disabled={isAddingKamar}>
        {isAddingKamar ? 'Menambahkan...' : 'Tambah Kamar'}
      </button>
      
      <h2>Daftar Kamar</h2>
      {kos.kamarList.map(kamar => (
        <div key={kamar.id}>
          <h3>{kamar.nama}</h3>
          <p>Status: {kamar.status}</p>
          <p>Harga: Rp {kamar.hargaSewa.toLocaleString()}</p>
          <p>Luas: {kamar.luasKamar} m²</p>
          
          <h4>Penghuni:</h4>
          {kamar.penghuniList?.map(penghuni => (
            <div key={penghuni.id}>
              {penghuni.nama} - {penghuni.email}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

## Example 4: Payment Management

```typescript
import { useState } from 'react';
import { usePayments } from '../hooks/useKosData';

function PaymentManager({ kosId, kamarId }: { kosId: string; kamarId: string }) {
  const { 
    payments, 
    loading, 
    error, 
    createPayment, 
    confirmPayment 
  } = usePayments(kosId, kamarId);
  
  const [showForm, setShowForm] = useState(false);

  const handleCreatePayment = async () => {
    try {
      await createPayment({
        bulan: 'Januari',
        tahun: 2026,
        jumlah: 800000,
        tanggalJatuhTempo: '2026-01-05'
      });
      setShowForm(false);
      alert('Pembayaran berhasil dibuat!');
    } catch (error: any) {
      alert('Gagal membuat pembayaran: ' + error.message);
    }
  };

  const handleConfirmPayment = async (paymentId: string) => {
    try {
      await confirmPayment(paymentId, {
        metodePembayaran: 'Transfer Bank'
      });
      alert('Pembayaran berhasil dikonfirmasi!');
    } catch (error: any) {
      alert('Gagal konfirmasi: ' + error.message);
    }
  };

  if (loading) return <div>Loading payments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Riwayat Pembayaran</h2>
      
      <button onClick={() => setShowForm(true)}>
        Buat Pembayaran Baru
      </button>
      
      {showForm && (
        <div>
          <button onClick={handleCreatePayment}>Simpan</button>
          <button onClick={() => setShowForm(false)}>Batal</button>
        </div>
      )}
      
      <table>
        <thead>
          <tr>
            <th>Bulan</th>
            <th>Tahun</th>
            <th>Jumlah</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.bulan}</td>
              <td>{payment.tahun}</td>
              <td>Rp {payment.jumlah.toLocaleString()}</td>
              <td>
                <span className={`badge badge-${payment.status}`}>
                  {payment.status}
                </span>
              </td>
              <td>
                {payment.status === 'belum_bayar' && (
                  <button onClick={() => handleConfirmPayment(payment.id)}>
                    Konfirmasi
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Example 5: Direct Service Call (Advanced)

```typescript
import { useState, useEffect } from 'react';
import { kosService } from '../services';

function CustomKosManager() {
  const [kosList, setKosList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom fetch function with filters
  const fetchFilteredKos = async (filters: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Direct API call with custom logic
      const allKos = await kosService.getKosList();
      
      // Apply custom filters
      let filtered = allKos;
      if (filters.minPrice) {
        filtered = filtered.filter(k => k.hargaMin >= filters.minPrice);
      }
      if (filters.city) {
        filtered = filtered.filter(k => k.alamat.includes(filters.city));
      }
      
      setKosList(filtered);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredKos({});
  }, []);

  const handleBulkUpdate = async (kosIds: string[], updates: any) => {
    try {
      setLoading(true);
      
      // Bulk update using Promise.all
      await Promise.all(
        kosIds.map(id => kosService.updateKos(id, updates))
      );
      
      // Refresh data
      await fetchFilteredKos({});
      alert('Bulk update berhasil!');
    } catch (error: any) {
      alert('Gagal update: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your custom UI here */}
    </div>
  );
}
```

---

## Example 6: With Authentication

```typescript
import { useEffect, useState } from 'react';
import { authService, kosService } from '../services';
import { useNavigate } from 'react-router-dom';

function ProtectedKosPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [kosList, setKosList] = useState([]);

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get current user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Fetch kos
    loadKos();
  }, [navigate]);

  const loadKos = async () => {
    try {
      const data = await kosService.getKosList();
      setKosList(data);
    } catch (error: any) {
      // If 401, user is auto-redirected by interceptor
      console.error('Error loading kos:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <header>
        <p>Welcome, {user.nama}!</p>
        <button onClick={handleLogout}>Logout</button>
      </header>
      
      <main>
        <h1>My Kos ({kosList.length})</h1>
        {kosList.map(kos => (
          <div key={kos.id}>{kos.nama}</div>
        ))}
      </main>
    </div>
  );
}
```

---

## Example 7: Error Handling Best Practices

```typescript
import { useState } from 'react';
import { kosService } from '../services';

function KosFormWithErrorHandling() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await kosService.createKos(formData);
      alert('Kos berhasil dibuat!');
      
    } catch (err: any) {
      // Handle different error types
      if (err.message) {
        // User-friendly error from backend
        setError(err.message);
      } else if (err.success === false) {
        // API error response
        setError(err.message || 'Terjadi kesalahan');
      } else {
        // Unexpected error
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
      
      // Log technical details for debugging
      console.error('Create kos error:', err);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = {/* ... */};
        handleSubmit(formData);
      }}>
        {/* Form fields */}
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}
```

---

## Example 8: Optimistic UI Updates

```typescript
import { useState } from 'react';
import { useKosData } from '../hooks/useKosData';

function OptimisticKosList() {
  const { kosList, addKos, deleteKos } = useKosData();
  const [localKosList, setLocalKosList] = useState(kosList);

  // Optimistic add
  const handleAddKos = async (kosData: any) => {
    // 1. Immediately update UI (optimistic)
    const tempKos = {
      ...kosData,
      id: 'temp-' + Date.now(),
      jumlahKamar: 0,
      kamarTerisi: 0,
      kamarList: []
    };
    setLocalKosList(prev => [...prev, tempKos]);

    try {
      // 2. Call API
      const newKos = await addKos(kosData);
      
      // 3. Replace temp with real data
      setLocalKosList(prev => 
        prev.map(k => k.id === tempKos.id ? newKos : k)
      );
      
    } catch (error) {
      // 4. Rollback on error
      setLocalKosList(prev => 
        prev.filter(k => k.id !== tempKos.id)
      );
      alert('Gagal menambahkan kos');
    }
  };

  // Optimistic delete
  const handleDeleteKos = async (kosId: string) => {
    // 1. Immediately remove from UI
    const backup = localKosList.find(k => k.id === kosId);
    setLocalKosList(prev => prev.filter(k => k.id !== kosId));

    try {
      // 2. Call API
      await deleteKos(kosId);
      
    } catch (error) {
      // 3. Restore on error
      if (backup) {
        setLocalKosList(prev => [...prev, backup]);
      }
      alert('Gagal menghapus kos');
    }
  };

  // Sync with hook data
  useEffect(() => {
    setLocalKosList(kosList);
  }, [kosList]);

  return (
    <div>
      {localKosList.map(kos => (
        <div key={kos.id}>
          <span>{kos.nama}</span>
          <button onClick={() => handleDeleteKos(kos.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Quick Reference

### Import Statements

```typescript
// Services
import { authService, kosService } from '../services';

// Hooks
import { useKosData, useKosDetail, usePayments } from '../hooks/useKosData';
import { useKosManagementAPI } from '../hooks/context/useKosManagementAPI';
```

### Common Patterns

```typescript
// 1. Simple list
const { kosList, loading, error } = useKosData();

// 2. Single detail
const { kos, loading, error } = useKosDetail(kosId);

// 3. Payments
const { payments, createPayment, confirmPayment } = usePayments(kosId, kamarId);

// 4. Direct service
const data = await kosService.getKosList();
await kosService.createKos({...});

// 5. Error handling
try {
  await kosService.createKos({...});
} catch (error: any) {
  alert(error.message);
}
```

---

**These examples show real-world usage patterns. Pick the one that fits your use case!** 🚀
