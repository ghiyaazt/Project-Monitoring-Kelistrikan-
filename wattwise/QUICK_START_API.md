# ⚡ Quick Start - API Integration

Panduan super cepat untuk mulai menggunakan API.

---

## 🚀 3 Langkah Mudah

### 1. Start Backend

```bash
cd backend
npm start
```

✅ Backend running di `http://localhost:5000`

---

### 2. Enable API di Frontend

Edit file `web2/wattwise/.env`:

```bash
REACT_APP_USE_API=true
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 3. Start Frontend

```bash
cd web2/wattwise
npm start
```

✅ Frontend running di `http://localhost:3000`

---

## ✅ Test

### Login

- Email: `admin@example.com`
- Password: `admin123456`

### Test di Console (F12)

Setelah login, test API:

```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('token'));

// Test fetch kos list
fetch('http://localhost:5000/api/web2/kos', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(res => res.json())
.then(data => console.log('Kos List:', data));
```

---

## 📝 Gunakan di Component

### Import Hook

```typescript
import { useKosData } from './hooks/useKosData';

function MyComponent() {
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

### Import Service

```typescript
import { kosService } from './services';

async function createKos() {
  try {
    const newKos = await kosService.createKos({
      nama: 'Kos Melati',
      alamat: 'Jl. Melati No. 123, Bandung',
      fasilitas: ['WiFi', 'AC']
    });
    alert('Berhasil!');
  } catch (error) {
    alert('Gagal: ' + error.message);
  }
}
```

---

## 📚 Dokumentasi Lengkap

- **Backend API:** `backend/API_WEB2_DOCUMENTATION.md`
- **Frontend Guide:** `web2/wattwise/API_INTEGRATION_GUIDE.md`
- **Code Examples:** `web2/wattwise/EXAMPLE_API_USAGE.md`
- **Complete Guide:** `INTEGRATION_COMPLETE_README.md`

---

## 🐛 Troubleshooting

**"Server tidak merespon"**
→ Pastikan backend running: `cd backend && npm start`

**"401 Unauthorized"**
→ Login dulu atau cek token di localStorage

**"Endpoint not found"**
→ Cek URL: harus `/api/web2/kos` bukan `/api/kos`

---

**That's it! You're ready to go! 🚀**
