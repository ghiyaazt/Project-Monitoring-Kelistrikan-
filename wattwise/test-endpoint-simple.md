# Test Endpoint Change Password - Manual

## Langkah 1: Test dengan Browser Console

Buka aplikasi di browser, buka Console (F12), lalu jalankan ini:

```javascript
// 1. Cek token
console.log('Token:', localStorage.getItem('token'));

// 2. Test endpoint manually
fetch('http://localhost:5000/api/auth/change-password', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    oldPassword: 'admin123456',
    newPassword: 'testpassword123'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Response:', data);
})
.catch(err => {
  console.error('Error:', err);
});
```

## Langkah 2: Cek Response

**Jika response:**
- `{success: true, message: "Password berhasil diubah"}` → **Backend OK!** Masalah di frontend.
- `{success: false, message: "Password lama salah"}` → **Backend OK!** Token OK, tapi password salah.
- `{success: false, message: "Endpoint not found"}` → **Backend route issue**
- Network Error atau No Response → **Backend tidak running atau CORS issue**

## Langkah 3: Cek Backend Terminal

Saat menjalankan test di atas, lihat terminal backend. Seharusnya muncul log:

```
PUT /api/auth/change-password 200
```

Atau mungkin:

```
PUT /api/auth/change-password 401
PUT /api/auth/change-password 404
```

Status code akan memberi tahu masalahnya.

## Langkah 4: Cek Network Tab

1. Buka Developer Tools (F12)
2. Tab Network
3. Clear network log (klik icon 🚫)
4. Jalankan fetch di console (step 1)
5. Lihat request yang muncul
6. Klik request tersebut
7. Check:
   - **Request URL**: Harus `http://localhost:5000/api/auth/change-password`
   - **Request Method**: Harus `PUT`
   - **Status Code**: Lihat berapa?
   - **Response Headers**: Ada CORS error?
   - **Response Body**: Apa pesannya?

## Expected Results

### ✅ Success Response:
```json
{
  "success": true,
  "message": "Password berhasil diubah"
}
```

### ❌ Wrong Password:
```json
{
  "success": false,
  "message": "Password lama salah"
}
```

### ❌ Endpoint Not Found:
```json
{
  "success": false,
  "message": "Endpoint not found"
}
```

### ❌ Not Authorized:
```json
{
  "success": false,
  "message": "Akses ditolak. Silakan login terlebih dahulu"
}
```
