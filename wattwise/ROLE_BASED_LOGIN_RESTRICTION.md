# 🔒 Role-Based Login Restriction - Penghuni Cannot Login to Web

## 📋 Summary

Login logic telah diperbarui untuk **mencegah penghuni login ke aplikasi web (Web2)**. Penghuni hanya dapat login melalui **aplikasi mobile**.

---

## 👥 Role Types

Aplikasi memiliki 3 jenis role:

1. **Owner** ✅ - Dapat login ke Web & Mobile
   - Pemilik kos
   - Mengelola kos, kamar, penghuni, dan pembayaran
   - Full access

2. **Admin** ✅ - Dapat login ke Web & Mobile
   - Administrator sistem
   - Mengelola data kos
   - Full access

3. **Penghuni** ❌ - **HANYA dapat login ke Mobile**
   - Penghuni kos
   - Melihat data kamar dan pembayaran mereka sendiri
   - **TIDAK dapat login ke Web2**

---

## 🔧 Implementation

### Backend Changes

**File:** `backend/src/controllers/authController.js`

**Location:** Login function (POST `/api/auth/login`)

```javascript
// Restrict penghuni from logging in to web (Web2)
// Penghuni can only login via mobile app
if (user.role === "penghuni") {
    return res.status(403).json({
        success: false,
        message: "Akun penghuni hanya dapat login melalui aplikasi mobile"
    });
}
```

**Logic:**
1. User submits login credentials
2. Backend validates email & password
3. Backend checks user role
4. **If role = "penghuni"** → Return HTTP 403 (Forbidden) with error message
5. **If role = "owner" or "admin"** → Generate token and allow login

---

### Frontend Changes

**File:** `web2/wattwise/src/features/auth/components/Login/Login.tsx`

**Changes:**
- Error from backend automatically displayed
- No additional frontend validation needed
- Backend error message shown directly to user

**Error Handling:**
```typescript
try {
  const response = await authService.login({ email, password });
  
  if (response.success && response.data) {
    // Login successful
    setUser(response.data.user);
    onLogin();
  } else {
    // Show backend error message
    setError(response.message || "Login gagal");
  }
} catch (err: any) {
  // Show error message from backend
  setError(err.message || "Email atau password salah");
}
```

---

## 🧪 Testing

### Test Case 1: Owner Login ✅

**Scenario:** Owner tries to login to Web2

**Steps:**
1. Go to login page
2. Enter owner credentials:
   - Email: `owner@example.com`
   - Password: `ownerpassword`
3. Click "Masuk"

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to dashboard
- ✅ Token saved
- ✅ User data loaded

---

### Test Case 2: Admin Login ✅

**Scenario:** Admin tries to login to Web2

**Steps:**
1. Go to login page
2. Enter admin credentials:
   - Email: `admin@example.com`
   - Password: `adminpassword`
3. Click "Masuk"

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to dashboard
- ✅ Token saved
- ✅ User data loaded

---

### Test Case 3: Penghuni Login ❌

**Scenario:** Penghuni tries to login to Web2

**Steps:**
1. Go to login page
2. Enter penghuni credentials:
   - Email: `penghuni@example.com`
   - Password: `penghunipassword`
3. Click "Masuk"

**Expected Result:**
- ❌ Login BLOCKED
- ❌ Error message displayed:
  ```
  "Akun penghuni hanya dapat login melalui aplikasi mobile"
  ```
- ❌ Not redirected
- ❌ No token saved
- ❌ User remains on login page

**Console Output:**
```
🔌 Attempting login via REAL API...
Email: penghuni@example.com
❌ Login error: Akun penghuni hanya dapat login melalui aplikasi mobile
```

---

### Test Case 4: Invalid Credentials ❌

**Scenario:** Wrong email or password

**Steps:**
1. Go to login page
2. Enter invalid credentials:
   - Email: `owner@example.com`
   - Password: `wrongpassword`
3. Click "Masuk"

**Expected Result:**
- ❌ Login failed
- ❌ Error message: "Email atau password salah"
- ❌ User remains on login page

---

### Test Case 5: Inactive Account ❌

**Scenario:** User account is deactivated

**Steps:**
1. Deactivate user account in database:
   ```javascript
   await User.findByIdAndUpdate(userId, { isActive: false });
   ```
2. Try to login with that account

**Expected Result:**
- ❌ Login failed
- ❌ Error message: "Akun Anda tidak aktif"
- ❌ User remains on login page

---

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────┐
│  User enters email & password           │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Frontend sends POST /api/auth/login    │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Backend: Find user by email            │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴───────┐
         │ User exists?  │
         └───────┬───────┘
                 │
        ┌────────┴────────┐
        │ NO              │ YES
        ▼                 ▼
   ┌─────────┐    ┌──────────────┐
   │  401    │    │ Check active │
   │ Error   │    └──────┬───────┘
   └─────────┘           │
                  ┌──────┴──────┐
                  │   Active?   │
                  └──────┬──────┘
                         │
                ┌────────┴────────┐
                │ NO              │ YES
                ▼                 ▼
           ┌─────────┐    ┌──────────────┐
           │  401    │    │ Verify pass  │
           │ Error   │    └──────┬───────┘
           └─────────┘           │
                          ┌──────┴──────┐
                          │ Pass match? │
                          └──────┬──────┘
                                 │
                        ┌────────┴────────┐
                        │ NO              │ YES
                        ▼                 ▼
                   ┌─────────┐    ┌──────────────┐
                   │  401    │    │  Check role  │
                   │ Error   │    └──────┬───────┘
                   └─────────┘           │
                                  ┌──────┴──────────┐
                                  │ role=penghuni? │
                                  └──────┬──────────┘
                                         │
                                ┌────────┴────────┐
                                │ YES             │ NO
                                ▼                 ▼
                           ┌─────────┐    ┌──────────────┐
                           │  403    │    │ Generate JWT │
                           │ Error   │    │ Login OK ✅  │
                           │ Mobile  │    └──────────────┘
                           │ only    │
                           └─────────┘
```

---

## 🌐 API Response Examples

### Success (Owner/Admin)

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "owner@example.com",
  "password": "ownerpassword"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "user123",
      "nama": "John Doe",
      "email": "owner@example.com",
      "no_telp": "08123456789",
      "role": "owner"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Error (Penghuni)

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "penghuni@example.com",
  "password": "penghunipassword"
}
```

**Response:** `403 Forbidden`
```json
{
  "success": false,
  "message": "Akun penghuni hanya dapat login melalui aplikasi mobile"
}
```

---

### Error (Wrong Password)

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "owner@example.com",
  "password": "wrongpassword"
}
```

**Response:** `401 Unauthorized`
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

---

## 📱 Mobile App vs Web

### Web (Web2) ✅
- **Allowed Roles:** `owner`, `admin`
- **Blocked Roles:** `penghuni`
- **Features:**
  - Dashboard
  - Manage Kos
  - Manage Kamar
  - Manage Penghuni
  - Manage Pembayaran
  - Reports

### Mobile App ✅
- **Allowed Roles:** `owner`, `admin`, `penghuni`
- **Features (Penghuni):**
  - View kamar details
  - View payment status
  - View payment history
  - Notifications
  - **Cannot manage kos/kamar/other penghuni**

---

## 🔐 Security Notes

### HTTP Status Codes

- **401 Unauthorized** - Invalid credentials (wrong email or password)
- **403 Forbidden** - Valid credentials but access denied (penghuni role)

### Best Practices

1. ✅ Role validation happens **on backend** (server-side)
2. ✅ Frontend shows clear error messages
3. ✅ No sensitive info leaked in error messages
4. ✅ Consistent error handling across endpoints
5. ✅ JWT token only generated for allowed roles

---

## 📝 Database Schema

### User Model

```javascript
{
  nama: String,
  email: String,
  no_telp: String,
  password: String (hashed),
  role: String (enum: ['owner', 'admin', 'penghuni']),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✅ Checklist

After implementation, verify:

- [x] Backend blocks penghuni login with 403 error
- [x] Frontend displays backend error message
- [x] Owner can login successfully
- [x] Admin can login successfully
- [x] Penghuni cannot login to web
- [x] Error message is clear and helpful
- [x] No token generated for penghuni
- [x] No redirect happens for penghuni
- [x] Console logs show correct flow
- [x] UI remains unchanged (only error message displayed)

---

## 🎯 Future Enhancements

### Potential Improvements

1. **Role-based Redirects**
   - Owner → Dashboard
   - Admin → Dashboard
   - (Mobile) Penghuni → Kamar Detail

2. **Enhanced Error Messages**
   - Show "Download Mobile App" link for penghuni
   - Show QR code for mobile app download

3. **Login Attempt Tracking**
   - Log failed penghuni login attempts
   - Security monitoring

4. **Multi-platform Detection**
   - Detect if user is on mobile web browser
   - Show appropriate message

---

## 🐛 Troubleshooting

### Issue 1: Penghuni can still login

**Possible Causes:**
- Backend not restarted after changes
- Frontend using localStorage mock instead of API
- Environment variable `REACT_APP_USE_API` not set to `true`

**Solution:**
```bash
# Restart backend
cd backend
npm start

# Check frontend .env
REACT_APP_USE_API=true

# Restart frontend
cd web2/wattwise
npm start
```

---

### Issue 2: Error message not showing

**Possible Causes:**
- Frontend not catching backend error
- Network error
- CORS issue

**Solution:**
- Check browser console for error logs
- Verify backend response in Network tab
- Check CORS settings in backend

---

## 📚 Related Files

### Backend
- `backend/src/controllers/authController.js` - Login validation
- `backend/src/models/User.js` - User schema with role

### Frontend
- `web2/wattwise/src/features/auth/components/Login/Login.tsx` - Login UI
- `web2/wattwise/src/services/authService.ts` - API calls
- `web2/wattwise/.env` - Environment config

---

## 🎉 Status

**Role-Based Login Restriction:** ✅ **Complete**

**Working:**
- ✅ Penghuni blocked from web login
- ✅ Owner and Admin can login
- ✅ Clear error messages
- ✅ Secure backend validation
- ✅ Consistent error handling

**Next Steps:**
- Continue with other page integrations
- Add mobile app integration for penghuni

---

**Last Updated:** 2026-11-03
