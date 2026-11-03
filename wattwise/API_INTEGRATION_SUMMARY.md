# 📋 Ringkasan Implementasi API

## ✅ Halaman yang Sudah Diintegrasikan dengan API

### 1. Halaman Daftar Kos (`/pages/Landing/DaftarKos.tsx`)

**Fitur yang Diimplementasikan:**
- ✅ Fetch data kos dari API menggunakan `kosService.getAllKos()`
- ✅ Loading state saat mengambil data
- ✅ Error handling dengan pesan error yang informatif
- ✅ Tombol "Coba lagi" untuk retry request
- ✅ Search/filter kos (frontend + backend)
- ✅ Tambah kos baru melalui API `kosService.createKos()`
- ✅ Transformasi data API ke format yang sesuai dengan komponen
- ✅ Kombinasi data dari API dan context (fallback)

**API Endpoints yang Digunakan:**
- `GET /api/kos` - Mendapatkan semua kos
- `POST /api/kos` - Membuat kos baru

**Struktur Data Response:**
```javascript
{
  success: true,
  count: 5,
  data: [
    {
      _id: "...",
      namaKos: "Kos Mawar",
      alamat: {
        jalan: "Jl. Mawar No. 10",
        kota: "Bogor",
        provinsi: "Jawa Barat"
      },
      gambar: ["url1", "url2"],
      gambarProfil: 0,
      fasilitasUmum: ["WiFi", "Parkir"],
      statistik: {
        totalKamar: 10,
        kamarTerisi: 7,
        kamarKosong: 3,
        hargaTerendah: 500000,
        hargaTertinggi: 1000000
      }
    }
  ]
}
```

**Transformasi Data:**
```javascript
// Data API ditransform menjadi:
{
  id: kos._id,
  nama: kos.namaKos,
  alamat: `${kos.alamat.jalan}, ${kos.alamat.kota}`,
  hargaMin: kos.statistik.hargaTerendah,
  hargaMax: kos.statistik.hargaTertinggi,
  jumlahKamar: kos.statistik.totalKamar,
  kamarTerisi: kos.statistik.kamarTerisi,
  fasilitas: kos.fasilitasUmum,
  gambar: kos.gambar,
  gambarProfil: kos.gambarProfil
}
```

---

### 2. Komponen Daftar Kos Section (`/components/landing/landingPage/DaftarKosSection.tsx`)

**Fitur yang Diimplementasikan:**
- ✅ Fetch data kos dari API
- ✅ Loading state dengan spinner
- ✅ Search dan filter availability
- ✅ Transformasi data untuk landing page
- ✅ Kombinasi data dari API dan context

**Catatan:**
Komponen ini menggunakan endpoint yang sama dengan halaman Daftar Kos, namun ditampilkan dalam format landing page yang lebih visual.

---

### 3. Halaman Daftar Penghuni (`/pages/Dashboard/Kamar/Penghuni.tsx`)

**Fitur yang Diimplementasikan:**
- ✅ Fetch data penghuni dari API menggunakan `penghuniService.getAllPenghuni()`
- ✅ Loading state saat mengambil data
- ✅ Error handling dengan pesan error
- ✅ Tombol "Coba lagi" untuk retry request
- ✅ Search penghuni berdasarkan nama, email, atau kos
- ✅ Filter berdasarkan status pembayaran
- ✅ Transformasi data API ke format yang sesuai dengan tabel
- ✅ Kombinasi data dari API dan context (fallback)
- ✅ Menampilkan informasi lengkap: nama, email, telepon, kos, kamar, tanggal masuk, status pembayaran

**API Endpoints yang Digunakan:**
- `GET /api/penghuni` - Mendapatkan semua penghuni

**Struktur Data Response:**
```javascript
{
  success: true,
  count: 15,
  data: [
    {
      _id: "...",
      nama: "John Doe",
      email: "john@example.com",
      telepon: "08123456789",
      kamarId: {
        _id: "...",
        namaKamar: "Kamar 101",
        kosId: {
          _id: "...",
          namaKos: "Kos Mawar"
        }
      },
      tanggalMasuk: "2024-01-15",
      status: "aktif",
      payments: [
        {
          bulan: "Januari",
          tahun: 2024,
          status: "lunas",
          tanggalBayar: "2024-01-10"
        }
      ]
    }
  ]
}
```

**Transformasi Data:**
```javascript
// Data API ditransform menjadi:
{
  id: penghuni._id,
  nama: penghuni.nama,
  email: penghuni.email,
  telepon: penghuni.telepon,
  kosNama: penghuni.kamarId.kosId.namaKos,
  kamarNama: penghuni.kamarId.namaKamar,
  tanggalMasuk: penghuni.tanggalMasuk,
  status: penghuni.status,
  pembayaranTerakhir: latestPayment?.tanggalBayar,
  statusPembayaran: 'lunas' | 'belum_bayar' | 'terlambat' | 'sudah_bayar'
}
```

---

## 🔧 Service yang Digunakan

### 1. `kosService.ts`
```typescript
// Mengambil semua kos
await kosService.getAllKos({ search: searchQuery });

// Membuat kos baru
await kosService.createKos({
  namaKos: "Kos Melati",
  alamat: {
    jalan: "Jl. Melati",
    kota: "Bogor",
    provinsi: "Jawa Barat"
  },
  gambar: [],
  gambarProfil: 0
});

// Mengambil kos berdasarkan ID
await kosService.getKosById(id);

// Update kos
await kosService.updateKos(id, data);

// Delete kos
await kosService.deleteKos(id);
```

### 2. `penghuniService.ts`
```typescript
// Mengambil semua penghuni
await penghuniService.getAllPenghuni();

// Filter berdasarkan kamar
await penghuniService.getAllPenghuni({ kamarId: "..." });

// Membuat penghuni baru
await penghuniService.createPenghuni({
  nama: "John Doe",
  email: "john@example.com",
  telepon: "08123456789",
  kamarId: "..."
});

// Update penghuni
await penghuniService.updatePenghuni(id, data);

// Delete penghuni
await penghuniService.deletePenghuni(id);
```

---

## 🎯 Pola Implementasi yang Digunakan

### 1. Loading State Management
```typescript
const [isLoading, setIsLoading] = useState(true);

const fetchData = async () => {
  try {
    setIsLoading(true);
    const response = await service.getData();
    if (response.success) {
      setData(response.data);
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

### 2. Error Handling dengan Retry
```typescript
{error && (
  <div className="error-message">
    <p>{error}</p>
    <button onClick={() => {
      setError(null);
      fetchData();
    }}>
      Coba lagi
    </button>
  </div>
)}
```

### 3. Data Transformation
```typescript
// Transform API data to component format
const transformedData = apiData.map((item: any) => ({
  id: item._id || item.id,
  nama: item.namaKos || item.nama,
  // ... other transformations
}));
```

### 4. Hybrid Data Source (API + Context)
```typescript
// Combine API data with context data
const combinedData = [...apiData, ...contextData];

// Filter combined data
const filteredData = combinedData.filter(item => {
  return item.nama.toLowerCase().includes(search.toLowerCase());
});
```

---

## 📝 Catatan Penting

### Authentication
Semua request ke API menggunakan Bearer token yang disimpan di localStorage:
```typescript
// apiClient.ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor
Otomatis handle 401 (Unauthorized) dan redirect ke login:
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Environment Variables
Base URL API dikonfigurasi melalui `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
# or for production:
REACT_APP_API_URL=https://your-api.railway.app/api
```

---

## 🚀 Langkah Selanjutnya (Opsional)

Untuk halaman lain yang belum diintegrasikan:

1. **Halaman Detail Kos** - Implementasi fetch detail kos dan kamarnya
2. **Halaman Kamar** - Implementasi CRUD kamar
3. **Halaman Dashboard** - Implementasi fetch statistik
4. **Halaman Pembayaran** - Implementasi CRUD pembayaran
5. **Halaman Sensor** - Real-time data sensor dengan WebSocket/MQTT

---

## ✅ Testing

Untuk testing API integration:

1. Pastikan backend running di `http://localhost:5000`
2. Login terlebih dahulu untuk mendapatkan token
3. Token akan otomatis disimpan dan digunakan untuk request berikutnya
4. Buka halaman Daftar Kos atau Daftar Penghuni
5. Data akan otomatis di-fetch dari API

**Jika ada error:**
- Periksa console browser untuk error message
- Periksa Network tab untuk melihat request/response
- Pastikan backend sudah running
- Pastikan token masih valid (belum expired)

---

Dibuat: 3 November 2026
