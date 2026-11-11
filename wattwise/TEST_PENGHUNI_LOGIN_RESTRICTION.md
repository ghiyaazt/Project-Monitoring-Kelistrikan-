# 🧪 Testing Guide: Penghuni Login Restriction

## 📋 Quick Test Guide

Panduan cepat untuk testing bahwa penghuni tidak bisa login ke Web2.

---

## 🎯 Prerequisites

### 1. Backend Running
```bash
cd backend
npm start
```

### 2. Frontend Running
```bash
cd web2/wattwise
npm start
```

### 3. Environment Variable Set
```bash
# File: web2/wattwise/.env
REACT_APP_USE_API=true
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Test Users in Database

Pastikan database memiliki user dengan 3 role berbeda:

**Owner:**
```json
{
  "nama": "Owner Test",
  "email": "owner@test.com",
  "password": "password123",
  "role": "owner",
  "isActive": true
}
```

**Admin:**
```json
{
  "nama": "Admin Test",
  "email": "admin@test.com",
  "password": "password123",
  "role": "admin",
  "isActive": true
}
```

**Penghuni:**
```json
{
  "nama": "Penghuni Test",
  "email": "penghuni@test.com",
  "password": "password123",
  "role": "penghuni",
  "isActive": true
}
```

---

## 🧪 Test Scenarios

### ✅ Test 1: Owner Login (Should Succeed)

1. Open browser: `http://localhost:3000/login`
2. Enter credentials:
   - Email: `owner@test.com`
   - Password: `password123`
3. Click "Masuk"

**Expected Result:**
```
✅ Login successful
✅ Redirected to dashboard
✅ No error message
✅ Console log: "✅ Login successful: {nama: 'Owner Test', role: 'owner'}"
```

**Backend Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "...",
      "nama": "Owner Test",
      "email": "owner@test.com",
      "role": "owner"
    },
    "token": "eyJhbGc..."
  }
}
```

---

### ✅ Test 2: Admin Login (Should Succeed)

1. Open browser: `http://localhost:3000/login`
2. Enter credentials:
   - Email: `admin@test.com`
   - Password: `password123`
3. Click "Masuk"

**Expected Result:**
```
✅ Login successful
✅ Redirected to dashboard
✅ No error message
✅ Console log: "✅ Login successful: {nama: 'Admin Test', role: 'admin'}"
```

---

### ❌ Test 3: Penghuni Login (Should Fail)

1. Open browser: `http://localhost:3000/login`
2. Enter credentials:
   - Email: `penghuni@test.com`
   - Password: `password123`
3. Click "Masuk"

**Expected Result:**
```
❌ Login BLOCKED
❌ Error message displayed:
   "Akun penghuni hanya dapat login melalui aplikasi mobile"
❌ NOT redirected to dashboard
❌ Remains on login page
❌ Console log: "❌ Login error: Akun penghuni hanya dapat login melalui aplikasi mobile"
```

**Backend Response:**
```json
{
  "success": false,
  "message": "Akun penghuni hanya dapat login melalui aplikasi mobile"
}
```

**Screenshot:**
```
┌─────────────────────────────────────────────────┐
│  Login Page                                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  [❌ Error Banner]                              │
│  Akun penghuni hanya dapat login melalui       │
│  aplikasi mobile                                │
│                                                 │
│  Email: penghuni@test.com                       │
│  Password: ••••••••••                           │
│                                                 │
│  [Masuk Button]                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔍 Verification Steps

### Step 1: Check Browser Network Tab

Open Developer Tools → Network Tab

**For Penghuni Login:**
```
Request:
  POST http://localhost:5000/api/auth/login
  {
    "email": "penghuni@test.com",
    "password": "password123"
  }

Response:
  Status: 403 Forbidden
  {
    "success": false,
    "message": "Akun penghuni hanya dapat login melalui aplikasi mobile"
  }
```

---

### Step 2: Check Browser Console

**For Penghuni Login:**
```
🔌 Attempting login via REAL API...
Email: penghuni@test.com
❌ Login error: {message: "Akun penghuni hanya dapat login melalui aplikasi mobile"}
```

---

### Step 3: Check Backend Logs

Backend terminal should show:
```
POST /api/auth/login
User found: penghuni@test.com
Role: penghuni
❌ Login blocked: Penghuni cannot login to web
Response: 403 Forbidden
```

---

### Step 4: Check LocalStorage

**For Penghuni (Failed Login):**
```javascript
localStorage.getItem('token')  // null
localStorage.getItem('user')   // null
```

**For Owner/Admin (Successful Login):**
```javascript
localStorage.getItem('token')  // "eyJhbGc..."
localStorage.getItem('user')   // "{nama: 'Owner Test', email: '...'}"
```

---

## 🛠️ Manual Database Testing

### Create Test Users Manually

**Using MongoDB Shell:**
```javascript
// Connect to MongoDB
mongo

// Use wattwise database
use wattwise

// Insert test users (password will be auto-hashed by pre-save hook)
db.users.insertMany([
  {
    nama: "Owner Test",
    email: "owner@test.com",
    no_telp: "08111111111",
    password: "$2a$10$...", // hashed: password123
    role: "owner",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nama: "Penghuni Test",
    email: "penghuni@test.com",
    no_telp: "08122222222",
    password: "$2a$10$...", // hashed: password123
    role: "penghuni",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

**Or use Register API:**
```bash
# Register Owner
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Owner Test",
    "email": "owner@test.com",
    "no_telp": "08111111111",
    "password": "password123",
    "konfirmasiPassword": "password123",
    "role": "owner"
  }'

# Register Penghuni
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Penghuni Test",
    "email": "penghuni@test.com",
    "no_telp": "08122222222",
    "password": "password123",
    "konfirmasiPassword": "password123",
    "role": "penghuni"
  }'
```

---

## 🧪 Automated Testing with Postman

### Test Collection

**1. Login as Owner (Success)**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "owner@test.com",
  "password": "password123"
}

Test Script:
pm.test("Status is 200", () => {
  pm.response.to.have.status(200);
});
pm.test("Success is true", () => {
  pm.expect(pm.response.json().success).to.be.true;
});
pm.test("Token exists", () => {
  pm.expect(pm.response.json().data.token).to.exist;
});
```

**2. Login as Penghuni (Fail)**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "penghuni@test.com",
  "password": "password123"
}

Test Script:
pm.test("Status is 403", () => {
  pm.response.to.have.status(403);
});
pm.test("Success is false", () => {
  pm.expect(pm.response.json().success).to.be.false;
});
pm.test("Error message contains 'mobile'", () => {
  pm.expect(pm.response.json().message).to.include("mobile");
});
pm.test("No token returned", () => {
  pm.expect(pm.response.json().data).to.not.exist;
});
```

---

## 📊 Test Results Summary

### Expected Results Table

| Role      | Email              | Password    | HTTP Status | Result       | Token | Redirect |
|-----------|-------------------|-------------|-------------|--------------|-------|----------|
| Owner     | owner@test.com    | password123 | 200 OK      | ✅ Success   | Yes   | Yes      |
| Admin     | admin@test.com    | password123 | 200 OK      | ✅ Success   | Yes   | Yes      |
| Penghuni  | penghuni@test.com | password123 | 403 Forbidden | ❌ Blocked | No    | No       |
| Any       | any@test.com      | wrongpass   | 401 Unauthorized | ❌ Failed | No    | No       |

---

## 🎥 Testing Video Script

### Recording Steps

1. **Show Prerequisites**
   - Terminal 1: Backend running
   - Terminal 2: Frontend running
   - Show .env file with `REACT_APP_USE_API=true`

2. **Test Owner Login**
   - Open login page
   - Enter owner credentials
   - Click Masuk
   - Show redirect to dashboard
   - Show localStorage token

3. **Test Penghuni Login**
   - Logout
   - Return to login page
   - Enter penghuni credentials
   - Click Masuk
   - **Show error message displayed**
   - Show browser console error
   - Show Network tab 403 response
   - Show localStorage is empty (no token)
   - User stays on login page

4. **Compare Responses**
   - Show Postman requests side-by-side
   - Owner: 200 OK with token
   - Penghuni: 403 Forbidden without token

---

## ✅ Final Checklist

Before considering the feature complete:

- [ ] Owner can login successfully
- [ ] Admin can login successfully
- [ ] Penghuni login is blocked
- [ ] Error message "Akun penghuni hanya dapat login melalui aplikasi mobile" displayed
- [ ] HTTP 403 status returned from backend
- [ ] No token generated for penghuni
- [ ] No redirect happens for penghuni
- [ ] LocalStorage remains empty for penghuni
- [ ] Browser console shows error
- [ ] Network tab shows 403 response
- [ ] Backend logs show blocked login
- [ ] UI/UX unchanged (only error message added)
- [ ] Dark mode works with error message
- [ ] Error message is responsive

---

## 🐛 Common Issues

### Issue 1: Penghuni can still login

**Debug:**
```bash
# Check if backend changes applied
grep -n "penghuni" backend/src/controllers/authController.js

# Should show the role check around line 115-120
```

**Solution:**
- Restart backend: `npm start`
- Clear browser cache
- Hard refresh: `Ctrl + F5`

---

### Issue 2: Error message not showing

**Debug:**
```javascript
// Add console.log in Login.tsx
catch (err: any) {
  console.log('ERROR OBJECT:', err);
  console.log('ERROR MESSAGE:', err.message);
  setError(err.message || "Email atau password salah");
}
```

**Solution:**
- Check Network tab for actual response
- Verify `REACT_APP_USE_API=true`
- Restart frontend after .env changes

---

### Issue 3: Getting wrong error message

**Example:** "Email atau password salah" instead of "Akun penghuni hanya dapat login melalui aplikasi mobile"

**Debug:**
- Check backend logs
- Check Network tab response body
- Verify password is correct

**Solution:**
- Make sure password is correct (error occurs AFTER password verification)
- Backend must validate password BEFORE checking role

---

## 📝 Test Report Template

```markdown
# Test Report: Penghuni Login Restriction

**Date:** 2026-11-03
**Tester:** [Your Name]
**Environment:** Development

## Test Results

### 1. Owner Login
- Status: ✅ PASS
- Time: 850ms
- Notes: Redirected to dashboard successfully

### 2. Admin Login
- Status: ✅ PASS
- Time: 920ms
- Notes: Redirected to dashboard successfully

### 3. Penghuni Login
- Status: ✅ PASS (Blocked as expected)
- Time: 780ms
- Error Message: "Akun penghuni hanya dapat login melalui aplikasi mobile"
- HTTP Status: 403 Forbidden
- Notes: Error displayed correctly, no redirect

### 4. Invalid Credentials
- Status: ✅ PASS
- Time: 650ms
- Error Message: "Email atau password salah"
- HTTP Status: 401 Unauthorized

## Summary
- Total Tests: 4
- Passed: 4
- Failed: 0
- Success Rate: 100%

## Conclusion
All tests passed. Penghuni login restriction working as expected.
```

---

**Happy Testing!** 🚀
