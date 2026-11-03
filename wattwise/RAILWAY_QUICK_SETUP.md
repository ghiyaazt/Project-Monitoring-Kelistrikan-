# ⚡ Railway Quick Setup - WattWise

Setup backend ke Railway dalam 5 menit!

---

## 🎯 Yang Perlu Disiapkan

1. ✅ Backend code udah ready
2. ✅ MongoDB Atlas credentials
3. ✅ GitHub account
4. ✅ Railway account (gratis)

---

## 🚀 Deployment dalam 5 Langkah

### 1️⃣ Push ke GitHub (Kalo belum)

```bash
cd backend
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2️⃣ Deploy di Railway

1. Buka: https://railway.app/
2. Login dengan GitHub
3. Klik **"New Project"**
4. Pilih **"Deploy from GitHub repo"**
5. Pilih repository kamu
6. Railway akan auto-detect dan deploy! 🚀

### 3️⃣ Set Environment Variables

Di Railway Dashboard → Variables, copy-paste ini:

```env
PORT=5000
MONGODB_URI=mongodb+srv://redgmaing66_db_user:IwS9zLMfTtMz8p5m@cluster0.mcteeff.mongodb.net/wattwise?retryWrites=true&w=majority
MONGODB_IOT_URI=mongodb+srv://redgmaing66_db_user:IwS9zLMfTtMz8p5m@cluster0.mcteeff.mongodb.net/test?retryWrites=true&w=majority
JWT_SECRET=wattwise-secret-key-2025-production
JWT_EXPIRE=7d
NODE_ENV=production
```

Klik **"Add"** untuk setiap variable.

### 4️⃣ Whitelist Railway di MongoDB Atlas

1. Buka MongoDB Atlas: https://cloud.mongodb.com/
2. Go to: Network Access
3. Klik **"Add IP Address"**
4. Pilih **"Allow Access from Anywhere"** → `0.0.0.0/0`
5. Atau tambah specific Railway IPs (cek Railway dashboard)

### 5️⃣ Test Backend!

Railway akan kasih URL seperti:
```
https://your-app-name.up.railway.app
```

Test dengan curl:
```bash
# Health check
curl https://your-app-name.up.railway.app/

# Test login
curl -X POST https://your-app-name.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 🌐 Update Frontend

### Web2 Frontend

**File: `web2/wattwise/.env`**

Uncomment production URL dan update:
```env
# Development
# REACT_APP_API_URL=http://localhost:5000/api

# Production (uncomment dan ganti URL)
REACT_APP_API_URL=https://your-railway-app.up.railway.app/api
```

### Mobile App

Update API base URL di config:
```javascript
const API_URL = 'https://your-railway-app.up.railway.app/api';
```

---

## ✅ Verification Checklist

Setelah deploy, cek ini:

- [ ] Railway deployment success (check logs)
- [ ] MongoDB wattwise connected
- [ ] MongoDB test connected  
- [ ] Health endpoint responds
- [ ] Login API works
- [ ] Register API works
- [ ] Frontend bisa connect

---

## 🔄 Auto-Deploy Setup

Railway automatically deploys saat kamu push ke GitHub:

```bash
# Make changes
git add .
git commit -m "Update backend"
git push origin main

# Railway auto-deploy! 🚀
```

---

## 📊 Check Logs

**Di Railway Dashboard:**
1. Klik project kamu
2. Klik **"Deployments"**
3. Klik **"View Logs"**

Look for:
```
✅ Main MongoDB (wattwise) connected successfully
✅ IoT MongoDB (test) connected successfully
🚀 WattWise Backend running on port 5000
```

---

## 🐛 Troubleshooting

### Backend ga jalan?
1. Check deployment logs di Railway
2. Verify env variables udah benar
3. Check MongoDB Atlas network access

### MongoDB connection failed?
1. Check MongoDB credentials
2. Verify network access (0.0.0.0/0)
3. Check connection strings format

### CORS error di frontend?
1. Verify frontend URL di CORS config
2. Check API URL di frontend .env
3. Rebuild frontend setelah update .env

---

## 💡 Tips

1. **Free Tier**: Railway kasih $5 credit per bulan (cukup buat testing)
2. **Always On**: Upgrade ke Hobby ($5/month) supaya ga sleep
3. **Custom Domain**: Bisa set di Railway settings
4. **Monitoring**: Check logs regularly untuk error

---

## 📝 Important URLs

```
Railway Dashboard: https://railway.app/
Your Backend: https://your-app-name.up.railway.app
MongoDB Atlas: https://cloud.mongodb.com/
```

---

## 🎯 Database Structure

Setelah deploy, struktur database:

```
MongoDB Atlas Cluster
├── test (IoT data)
│   └── sensor_data
│
└── wattwise (Web/Mobile)
    ├── users
    ├── kos
    ├── rooms
    └── devices
```

---

## 🎉 Done!

Backend kamu sekarang:
- ✅ Running 24/7 di Railway
- ✅ Connected to 2 MongoDB databases
- ✅ Auto-deploy on git push
- ✅ Ready for production!

**Next Step:** Update frontend untuk point ke Railway URL!

---

*Untuk dokumentasi lengkap, baca: `RAILWAY_DEPLOYMENT.md`*
