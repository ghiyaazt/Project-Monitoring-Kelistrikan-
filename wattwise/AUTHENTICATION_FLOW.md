# 🔐 Authentication Flow - WattWise

Dokumentasi visual untuk flow autentikasi di WattWise Web2.

---

## 📊 System Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Frontend │◄───────►│  Express Backend │◄───────►│    MongoDB      │
│  (Port 3000)    │  HTTP   │  (Port 5000)     │         │  (Port 27017)   │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
       │                            │
       │                            │
       ▼                            ▼
┌─────────────────┐         ┌──────────────────┐
│  localStorage   │         │   JWT Token      │
│  - token        │         │   - User ID      │
│  - user data    │         │   - Expiry: 7d   │
└─────────────────┘         └──────────────────┘
```

---

## 🔄 Login Flow

```
┌──────────────┐
│ Landing Page │
└──────┬───────┘
       │ Click "Masuk"
       ▼
┌──────────────┐
│  Login Page  │
└──────┬───────┘
       │ Enter email & password
       │ Click "Masuk"
       ▼
┌────────────────────────┐
│ Login.tsx              │
│ - handleSubmit()       │
│ - Validate inputs      │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ authService.login()    │
│ POST /api/auth/login   │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐      ┌─────────────────┐
│ Backend authController │─────►│ MongoDB Query   │
│ - Check email exists   │      │ users.findOne() │
│ - Verify password      │◄─────│                 │
│ - Generate JWT token   │      └─────────────────┘
└──────┬─────────────────┘
       │
       ▼
    Success?
       │
   ┌───┴───┐
   │       │
  YES     NO
   │       │
   │       └───► Error Response
   │             └─► Show error message
   ▼
┌────────────────────────┐
│ Response with token    │
│ {                      │
│   success: true,       │
│   data: {              │
│     user: {...},       │
│     token: "eyJ..."    │
│   }                    │
│ }                      │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ authService            │
│ - Save token to        │
│   localStorage         │
│ - Save user to         │
│   localStorage         │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ AppContext             │
│ - setUser()            │
│ - Update context       │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Redirect to Dashboard  │
└────────────────────────┘
```

---

## 📝 Register Flow

```
┌──────────────┐
│ Landing Page │
└──────┬───────┘
       │ Click "Daftar"
       ▼
┌────────────────┐
│ Register Page  │
└──────┬─────────┘
       │ Fill form:
       │ - Nama
       │ - Email
       │ - No Telp
       │ - Role
       │ - Password
       │ - Konfirmasi
       │
       │ Click "Daftar Sekarang"
       ▼
┌──────────────────────────┐
│ Register.tsx             │
│ - handleSubmit()         │
│ - Validate all fields    │
│ - Check password match   │
│ - Check password strength│
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ authService.register()   │
│ POST /api/auth/register  │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐      ┌─────────────────┐
│ Backend authController   │─────►│ MongoDB Query   │
│ - Check email unique     │      │ users.findOne() │
│ - Hash password          │      │                 │
│ - Create user            │─────►│ users.create()  │
│ - Generate JWT token     │◄─────│                 │
└──────┬───────────────────┘      └─────────────────┘
       │
       ▼
    Success?
       │
   ┌───┴───┐
   │       │
  YES     NO
   │       │
   │       └───► Error Response
   │             └─► Show error message
   │                 (Email exists, etc)
   ▼
┌──────────────────────────┐
│ Response with token      │
│ {                        │
│   success: true,         │
│   message: "Registrasi   │
│             berhasil",   │
│   data: {                │
│     user: {...},         │
│     token: "eyJ..."      │
│   }                      │
│ }                        │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Auto Login Process       │
│ - Save token             │
│ - Save user              │
│ - Update context         │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Redirect to Dashboard    │
└──────────────────────────┘
```

---

## 🔒 Token Management Flow

```
┌──────────────────────────┐
│ User Login/Register      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Backend generates JWT    │
│ - Payload: { id: userId }│
│ - Secret: JWT_SECRET     │
│ - Expiry: 7 days         │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Token sent to frontend   │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ authService saves token  │
│ localStorage.setItem()   │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Every API request        │
│ apiClient interceptor    │
│ adds token to header:    │
│ Authorization: Bearer... │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Backend verifies token   │
│ authMiddleware.protect() │
└──────┬───────────────────┘
       │
   ┌───┴───┐
   │       │
 Valid  Invalid
   │       │
   │       └───► 401 Unauthorized
   │             └─► Interceptor catches
   │                 └─► Clear token
   │                     └─► Redirect to login
   ▼
┌──────────────────────────┐
│ Request proceeds         │
│ with user context        │
└──────────────────────────┘
```

---

## 🔄 Protected Route Flow

```
┌──────────────────────────┐
│ User navigates to        │
│ protected page           │
│ (Dashboard, Profile, etc)│
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Check token exists?      │
└──────┬───────────────────┘
       │
   ┌───┴───┐
   │       │
  YES     NO
   │       │
   │       └───► Redirect to Login
   ▼
┌──────────────────────────┐
│ Make API request with    │
│ token in header          │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Backend validates token  │
└──────┬───────────────────┘
       │
   ┌───┴───┐
   │       │
 Valid  Invalid
   │       │
   │       └───► 401 Response
   │             └─► Clear storage
   │                 └─► Redirect to Login
   ▼
┌──────────────────────────┐
│ Load page content        │
└──────────────────────────┘
```

---

## 📱 Error Handling Flow

```
┌──────────────────────────┐
│ API Request              │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ apiClient interceptor    │
│ catches error            │
└──────┬───────────────────┘
       │
       ▼
    Error Type?
       │
   ┌───┴─────────────┐
   │                 │
  401              Other
   │                 │
   ▼                 ▼
┌─────────┐    ┌─────────┐
│ Clear   │    │ Return  │
│ token   │    │ error   │
│ Redirect│    │ message │
│ to login│    │ to      │
└─────────┘    │ component│
               └────┬────┘
                    │
                    ▼
              ┌─────────────┐
              │ Component   │
              │ shows error │
              │ message     │
              └─────────────┘
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│                                         │
│  Frontend Security                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • Input validation                     │
│  • Password strength check              │
│  • XSS prevention (React built-in)      │
│  • HTTPS (production)                   │
│                                         │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│                                         │
│  API Layer Security                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • CORS configuration                   │
│  • Request validation                   │
│  • Rate limiting (TODO)                 │
│  • JWT token verification               │
│                                         │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│                                         │
│  Backend Security                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • Password hashing (bcrypt)            │
│  • JWT secret encryption                │
│  • Input sanitization                   │
│  • SQL injection prevention (Mongoose)  │
│  • Authentication middleware            │
│                                         │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│                                         │
│  Database Security                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • Unique email constraint              │
│  • Password never returned in queries   │
│  • Indexed fields for performance       │
│  • Connection security                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📦 Data Flow

### Login Request:
```json
Frontend → Backend
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login Response:
```json
Backend → Frontend
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "673a1b2c...",
      "nama": "User Name",
      "email": "user@example.com",
      "no_telp": "08123456789",
      "role": "owner"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Stored in Frontend:
```javascript
// localStorage
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: "{\"name\":\"User Name\",\"email\":\"user@example.com\",...}"
}

// AppContext
currentUser: {
  name: "User Name",
  email: "user@example.com",
  deviceId: "FC24-0041"
}
```

---

## 🎯 Component Hierarchy

```
App.tsx
│
├─ Landing Page (appView === "landing")
│  └─ Buttons → Navigate to auth view
│
├─ Auth Flow (appView === "auth")
│  │
│  ├─ Login (authView === "login")
│  │  ├─ Form with email/password
│  │  ├─ authService.login()
│  │  └─ On success → Dashboard
│  │
│  ├─ Register (authView === "register")
│  │  ├─ Form with 6 fields
│  │  ├─ authService.register()
│  │  └─ On success → Auto login → Dashboard
│  │
│  ├─ Forgot Password
│  ├─ Verify OTP
│  └─ Reset Password
│
└─ Dashboard (loggedIn === true)
   ├─ Sidebar
   ├─ Pages (Dashboard, Kos, Kamar, etc)
   └─ Protected with token
```

---

## 🧪 Testing Flow

```
Manual Testing
│
├─ Login Tests
│  ├─ ✅ Valid credentials
│  ├─ ❌ Invalid email
│  ├─ ❌ Invalid password
│  ├─ ❌ Empty fields
│  └─ ❌ Backend down
│
├─ Register Tests
│  ├─ ✅ Valid data
│  ├─ ❌ Duplicate email
│  ├─ ❌ Password mismatch
│  ├─ ❌ Weak password
│  └─ ❌ Empty fields
│
├─ Token Tests
│  ├─ ✅ Token saved
│  ├─ ✅ Token sent with requests
│  ├─ ✅ 401 handling
│  └─ ✅ Auto logout on invalid
│
└─ Navigation Tests
   ├─ ✅ Login → Dashboard
   ├─ ✅ Register → Dashboard
   ├─ ✅ Logout → Login
   └─ ✅ Protected pages redirect
```

---

## 📈 Performance Considerations

### Frontend:
- ⚡ React optimizations (memo, useMemo)
- ⚡ Lazy loading components
- ⚡ Debounce form inputs
- ⚡ Minimize re-renders

### Backend:
- ⚡ MongoDB indexing on email
- ⚡ Password comparison optimization
- ⚡ JWT token caching
- ⚡ Connection pooling

### Network:
- ⚡ Compress responses (gzip)
- ⚡ Minimize payload size
- ⚡ Cache static assets
- ⚡ CDN for production

---

## 🚀 Deployment Flow

```
Development
│
├─ Frontend: localhost:3000
├─ Backend: localhost:5000
└─ MongoDB: localhost:27017
│
▼
Production
│
├─ Frontend: https://wattwise.com
│  └─ Served via: Vercel/Netlify/S3
│
├─ Backend: https://api.wattwise.com
│  └─ Deployed on: Railway/Heroku/AWS
│
└─ MongoDB: MongoDB Atlas (Cloud)
   └─ Connection string from env
```

---

**🎉 Flow Documentation Complete!**

*Last Updated: November 3, 2026*  
*WattWise Authentication System*
