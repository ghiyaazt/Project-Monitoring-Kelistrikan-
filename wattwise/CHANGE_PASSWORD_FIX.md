# 🔐 Change Password Fix - Backend Integration

Dokumentasi fix untuk fitur ubah password yang sekarang connect ke backend API.

---

## 🐛 Problem

**Before:**
- Modal "Ubah Password" pakai hardcoded validation
- Password lama di-check dengan `if (oldPassword !== "admin123")`
- Selalu error "Password lama salah!" meskipun password benar
- Tidak connect ke database

---

## ✅ Solution

### Frontend Changes:

**File: `ChangePasswordModal.tsx`**

**Before (Hardcoded):**
```typescript
// Simulasi verifikasi password lama
if (oldPassword !== "admin123") {
  setChangePasswordError("Password lama salah!");
  return;
}
```

**After (API Call):**
```typescript
// Call backend API
const response = await authService.changePassword(oldPassword, newPassword);

if (response.success) {
  setChangePasswordSuccess(true);
  // Close modal after 2s
} else {
  setChangePasswordError(response.message);
}
```

**New Features:**
- ✅ Real API integration
- ✅ Loading state
- ✅ Proper error handling
- ✅ Verify password via database

---

### Backend Changes:

**File: `authController.js`**

Added new endpoint:
```javascript
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  // Get user with password
  const user = await User.findById(req.user.id).select("+password");
  
  // Verify old password
  const isPasswordMatch = await user.comparePassword(oldPassword);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: "Password lama salah"
    });
  }
  
  // Update password
  user.password = newPassword;
  await user.save(); // Auto hash
  
  res.json({ success: true, message: "Password berhasil diubah" });
};
```

**File: `authRoutes.js`**

Added route:
```javascript
router.put("/change-password", protect, changePassword);
```

**File: `authService.ts`**

Added method:
```typescript
async changePassword(oldPassword: string, newPassword: string) {
  const response = await apiClient.put('/auth/change-password', {
    oldPassword,
    newPassword
  });
  return response.data;
}
```

---

## 🎯 Features

### Frontend:
- ✅ API integration dengan authService
- ✅ Loading state saat request
- ✅ Error handling yang proper
- ✅ Success message
- ✅ Auto close modal on success
- ✅ Disabled buttons saat loading

### Backend:
- ✅ Protected endpoint (requires login)
- ✅ Verify old password via bcrypt
- ✅ Auto hash new password
- ✅ Validation (minimal 6 characters)
- ✅ Proper error messages

---

## 🧪 Testing

### Test Case 1: Change Password Success ✅

**Steps:**
1. Login dengan user valid
2. Go to Profile page
3. Click "Ubah Password"
4. Enter:
   - Password Lama: `test123` (password yang benar)
   - Password Baru: `newpass123`
   - Konfirmasi: `newpass123`
5. Click "Ubah Password"

**Expected:**
- Loading spinner muncul
- Success message: "Password berhasil diubah!"
- Modal auto close setelah 2 detik
- Password ter-update di database

**Verify:**
```bash
# Login dengan password baru
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@test.com","password":"newpass123"}'

# Should succeed!
```

---

### Test Case 2: Wrong Old Password ❌

**Steps:**
1. Enter wrong old password: `wrongpass`
2. Enter new password: `newpass123`
3. Click "Ubah Password"

**Expected:**
- Error message: "Password lama salah atau terjadi kesalahan"
- Password tidak berubah

---

### Test Case 3: Password Mismatch ❌

**Steps:**
1. Enter correct old password
2. Password Baru: `newpass123`
3. Konfirmasi: `different456`
4. Click "Ubah Password"

**Expected:**
- Error message: "Password baru dan konfirmasi tidak sama!"
- Tidak hit API (client-side validation)

---

### Test Case 4: Password Too Short ❌

**Steps:**
1. Enter correct old password
2. Password Baru: `123` (< 6 characters)
3. Konfirmasi: `123`
4. Click "Ubah Password"

**Expected:**
- Error message: "Password minimal 6 karakter!"
- Tidak hit API

---

## 📊 API Documentation

### Endpoint: Change Password

**URL:** `PUT /api/auth/change-password`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "oldPassword": "currentPassword123",
  "newPassword": "newPassword456"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Password berhasil diubah"
}
```

**Response Error - Wrong Old Password (401):**
```json
{
  "success": false,
  "message": "Password lama salah"
}
```

**Response Error - Validation (400):**
```json
{
  "success": false,
  "message": "Password baru minimal 6 karakter"
}
```

**Response Error - Unauthorized (401):**
```json
{
  "success": false,
  "message": "Akses ditolak. Silakan login terlebih dahulu"
}
```

---

## 🔒 Security Features

### Password Hashing:
- Old password verified with bcrypt.compare()
- New password auto-hashed via User model pre-save hook
- Password never stored in plain text

### Authentication:
- Endpoint protected with JWT middleware
- Requires valid token
- Token must match user

### Validation:
- Client-side: Check all fields filled, match, length
- Server-side: Re-validate everything
- Double layer protection

---

## 🚀 How to Test

### 1. Start Backend:
```bash
cd backend
npm start
```

### 2. Start Frontend:
```bash
cd web2/wattwise
npm start
```

### 3. Login:
- Email: `owner@test.com`
- Password: `test123`

### 4. Go to Profile:
- Click "Profil" di sidebar

### 5. Click "Ubah Password" button

### 6. Test Change Password:
- Password Lama: `test123`
- Password Baru: `newpass123`
- Konfirmasi: `newpass123`
- Click "Ubah Password"

### 7. Verify Success:
- Should see success message
- Modal auto close
- Try login with new password

---

## 🐛 Troubleshooting

### Error: "Password lama salah" (tapi password benar)

**Possible causes:**
1. Backend belum restart after update
2. Token invalid/expired
3. User password di database beda

**Solution:**
1. Restart backend
2. Logout dan login ulang (refresh token)
3. Check password di MongoDB

---

### Error: "Server tidak merespon"

**Solution:**
1. Check backend running
2. Check endpoint registered: `PUT /api/auth/change-password`
3. Check route di authRoutes.js
4. Check controller method exported

---

### Password tidak berubah meskipun success

**Check:**
1. Pre-save hook running? (check User model)
2. Password di-hash sebelum save?
3. Check MongoDB user document updated

---

## ✅ Implementation Checklist

Completed:
- [x] Add changePassword method to authService
- [x] Update ChangePasswordModal to use API
- [x] Add loading state
- [x] Add error handling
- [x] Create backend endpoint
- [x] Add route to authRoutes
- [x] Verify old password
- [x] Hash new password
- [x] Test with real user
- [x] Documentation

---

## 📝 Files Modified

### Frontend:
```
✏️ src/services/authService.ts
✏️ src/components/dashboard/profile/ChangePasswordModal.tsx
```

### Backend:
```
✏️ src/controllers/authController.js
✏️ src/routes/authRoutes.js
```

### Documentation:
```
✨ CHANGE_PASSWORD_FIX.md
```

---

## 🎉 Result

**Before:**
- ❌ Hardcoded validation
- ❌ Always error "Password lama salah!"
- ❌ No database integration

**After:**
- ✅ Real API integration
- ✅ Proper password verification
- ✅ Password updated in database
- ✅ Loading & error states
- ✅ Security with JWT + bcrypt

---

**Last Updated:** November 3, 2026

**Status:** ✅ Fixed & Tested
