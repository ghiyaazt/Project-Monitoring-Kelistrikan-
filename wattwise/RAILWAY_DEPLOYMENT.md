# 🚂 Railway Deployment Guide - WattWise Backend

Panduan lengkap deploy backend WattWise ke Railway dengan dual MongoDB setup.

---

## 📋 Overview

### Database Architecture:
```
MongoDB Atlas Cluster
├── Database: test (IoT sensor data)
│   └── Collection: sensor_data
│   
└── Database: wattwise (Mobile & Web data)
    ├── Collection: users
    ├── Collection: kos
    ├── Collection: rooms
    ├── Collection: penghuni
    └── Collection: devices
```

### Connection Strings:
- **IoT Data (test)**: `mongodb+srv://redgmaing66_db_user:IwS9zLMfTtMz8p5m@cluster0.mcteeff.mongodb.net/test?retryWrites=true&w=majority`
- **Web/Mobile Data (wattwise)**: `mongodb+srv://redgmaing66_db_user:IwS9zLMfTtMz8p5m@cluster0.mcteeff.mongodb.net/wattwise?retryWrites=true&w=majority`

---

## 🚀 Step 1: Prepare Backend untuk Railway

### 1.1. Check Backend Files

Pastikan file-file ini sudah ada:

```
backend/
├── server.js              ✅ Entry point
├── package.json           ✅ Dependencies
├── .env                   ✅ Local config (don't commit!)
├── .gitignore             ✅ Ignore .env
├── src/
│   ├── app.js            ✅ Express app
│   ├── config/
│   │   └── database.js   ✅ Dual DB connection
│   ├── models/           ✅ All models
│   ├── controllers/      ✅ All controllers
│   └── routes/           ✅ All routes
└── railway.toml          ✅ Railway config (optional)
```

### 1.2. Update package.json

Pastikan ada script `start` untuk production:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### 1.3. Buat .gitignore

```gitignore
# Environment
.env
.env.local
.env.production

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

---

## 🚂 Step 2: Deploy ke Railway

### 2.1. Login ke Railway

1. Buka: https://railway.app/
2. Login dengan GitHub account
3. Klik **"New Project"**

### 2.2. Deploy dari GitHub

**Option A: Deploy from GitHub (Recommended)**

1. Klik **"Deploy from GitHub repo"**
2. Pilih repository: `Project-Monitoring-Kelistrikan`
3. Railway akan auto-detect Node.js app
4. Klik **"Deploy"**

**Option B: Deploy dari Local**

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Initialize project:
   ```bash
   cd backend
   railway init
   ```

4. Deploy:
   ```bash
   railway up
   ```

### 2.3. Set Environment Variables di Railway

Di Railway Dashboard → Your Project → Variables, tambahkan:

```bash
# Port (Railway auto-assign, tapi bisa set default)
PORT=5000

# MongoDB - Main Database (wattwise)
MONGODB_URI=mongodb+srv://redgmaing66_db_user:IwS9zLMfTtMz8p5m@cluster0.mcteeff.mongodb.net/wattwise?retryWrites=true&w=majority

# MongoDB - IoT Database (test)
MONGODB_IOT_URI=mongodb+srv://redgmaing66_db_user:IwS9zLMfTtMz8p5m@cluster0.mcteeff.mongodb.net/test?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=wattwise-secret-key-2025-production-railway
JWT_EXPIRE=7d

# MQTT Configuration (optional, kalo ada)
MQTT_BROKER_URL=mqtt://broker.hivemq.com
MQTT_PORT=1883
MQTT_CLIENT_ID=wattwise-railway-backend
MQTT_TOPIC_SUBSCRIBE=pzem/data

# Node Environment
NODE_ENV=production
```

**PENTING**: Ganti `JWT_SECRET` dengan value yang secure untuk production!

### 2.4. Generate Domain

Railway akan auto-generate domain seperti:
```
https://your-app-name.up.railway.app
```

Atau kamu bisa set custom domain di Settings → Domain.

---

## 🔍 Step 3: Verify Deployment

### 3.1. Check Deployment Logs

Di Railway Dashboard → Deployments → View Logs

Look for:
```
✅ Main MongoDB (wattwise) connected successfully
✅ IoT MongoDB (test) connected successfully
🚀 WattWise Backend running on port 5000
```

### 3.2. Test API Endpoints

**Health Check:**
```bash
curl https://your-railway-app.up.railway.app/
```

**Login API:**
```bash
curl -X POST https://your-railway-app.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Register API:**
```bash
curl -X POST https://your-railway-app.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Test User",
    "email": "newuser@example.com",
    "no_telp": "08123456789",
    "password": "Test123!",
    "konfirmasiPassword": "Test123!",
    "role": "owner"
  }'
```

---

## 🌐 Step 4: Update Frontend untuk Point ke Railway

### 4.1. Update Web2 Frontend

**File: `web2/wattwise/.env.production`**

```env
REACT_APP_API_URL=https://your-railway-app.up.railway.app/api
REACT_APP_WS_URL=wss://your-railway-app.up.railway.app
```

### 4.2. Development vs Production

**Local Development:**
```env
# .env
REACT_APP_API_URL=http://localhost:5000/api
```

**Production:**
```env
# .env.production
REACT_APP_API_URL=https://your-railway-app.up.railway.app/api
```

### 4.3. Build Frontend untuk Production

```bash
cd web2/wattwise

# Build production
npm run build

# The build folder will use .env.production
```

---

## 📱 Step 5: Update Mobile App

### 5.1. Update API Base URL

**File: Mobile app API config**

Ganti base URL dari localhost ke Railway URL:

```javascript
// Before
const API_URL = 'http://localhost:5000/api';

// After
const API_URL = 'https://your-railway-app.up.railway.app/api';
```

---

## 🔐 Step 6: Security Best Practices

### 6.1. Environment Variables

✅ **DO:**
- Use strong JWT_SECRET
- Keep MongoDB credentials secure
- Use Railway's environment variables (encrypted)
- Different secrets for dev vs prod

❌ **DON'T:**
- Commit .env to Git
- Use weak passwords
- Share credentials publicly
- Use same secrets for dev/prod

### 6.2. CORS Configuration

Update CORS di `src/app.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',           // Local web
    'https://your-website.com',        // Production web
    'https://your-railway-app.up.railway.app'  // Railway backend
  ],
  credentials: true
}));
```

### 6.3. MongoDB Atlas Security

1. **Whitelist Railway IPs**
   - Railway Dashboard → Settings → Public Networking
   - Copy the IP addresses
   - MongoDB Atlas → Network Access → Add IP
   - Add Railway IPs

2. **Or Allow All (Not recommended for production)**
   - MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (Allow from anywhere)

---

## 🔄 Step 7: Continuous Deployment

### 7.1. Auto-Deploy dari GitHub

Railway automatically deploys when you push to GitHub:

```bash
# Make changes to code
git add .
git commit -m "Update backend"
git push origin main

# Railway will automatically detect and deploy
```

### 7.2. Manual Deploy

```bash
# Using Railway CLI
cd backend
railway up
```

---

## 📊 Step 8: Monitoring & Logs

### 8.1. View Logs

**Railway Dashboard:**
- Go to your project
- Click **"Deployments"**
- Click **"View Logs"**

**Railway CLI:**
```bash
railway logs
```

### 8.2. Monitor Database Connections

Check logs for:
```
✅ Main MongoDB (wattwise) connected successfully
✅ IoT MongoDB (test) connected successfully
```

### 8.3. Monitor API Health

Create a simple health check endpoint:

**File: `src/app.js`**

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    mongodb: {
      main: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      iot: 'check logs'
    }
  });
});
```

Access: `https://your-railway-app.up.railway.app/health`

---

## 🐛 Troubleshooting

### Problem 1: MongoDB Connection Failed

**Symptom:**
```
❌ MongoDB connection failed: MongoServerSelectionError
```

**Solutions:**
1. Check MongoDB Atlas is accessible
2. Verify credentials are correct
3. Check Network Access whitelist in MongoDB Atlas
4. Verify connection strings format

### Problem 2: 502 Bad Gateway

**Symptom:**
Railway shows 502 error

**Solutions:**
1. Check deployment logs for errors
2. Verify `PORT` environment variable
3. Check app is listening on correct port:
   ```javascript
   app.listen(process.env.PORT || 5000)
   ```

### Problem 3: Environment Variables Not Working

**Symptom:**
App can't read env variables

**Solutions:**
1. Verify variables are set in Railway Dashboard
2. Redeploy after adding variables
3. Check variable names (case-sensitive)

### Problem 4: CORS Errors

**Symptom:**
Frontend can't access API

**Solutions:**
1. Add frontend URL to CORS whitelist
2. Check CORS middleware in app.js
3. Verify frontend is using correct API URL

---

## 📝 Post-Deployment Checklist

After deployment, verify:

- [ ] Backend is running (check logs)
- [ ] MongoDB connections successful (both test & wattwise)
- [ ] Health endpoint responds
- [ ] Login API works
- [ ] Register API works
- [ ] CORS allows frontend
- [ ] JWT tokens are generated
- [ ] IoT data goes to test database
- [ ] Auth data goes to wattwise database
- [ ] Frontend can connect to backend
- [ ] Mobile app can connect to backend

---

## 🔄 Update Workflow

### When you make changes:

1. **Update code locally**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Railway auto-deploys**
   - Watch deployment logs
   - Verify deployment success

3. **Test changes**
   - Check health endpoint
   - Test affected API endpoints
   - Verify database operations

4. **Update frontend if needed**
   - If API changes, update frontend
   - Rebuild and redeploy frontend

---

## 💰 Railway Pricing (as of 2024)

**Free Tier:**
- $5 free credits per month
- Good for development/testing
- May sleep after inactivity

**Hobby Plan ($5/month):**
- Better for production
- Always on (no sleep)
- Custom domains
- More resources

**Pro Plan ($20/month):**
- Production-ready
- High availability
- Priority support
- More resources

---

## 🎯 Quick Reference

### Railway URLs:
```
Dashboard: https://railway.app/
Your App: https://your-railway-app.up.railway.app
```

### Important Commands:
```bash
# Railway CLI
railway login
railway init
railway up
railway logs
railway status
railway variables

# Git Deploy
git push origin main  # Auto-deploys
```

### Environment Variables:
```
MONGODB_URI              → wattwise database
MONGODB_IOT_URI          → test database  
JWT_SECRET               → Production secret
NODE_ENV=production
```

---

## 📚 Additional Resources

- Railway Docs: https://docs.railway.app/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Express.js: https://expressjs.com/
- Node.js: https://nodejs.org/

---

## 🎉 Success!

Setelah deploy berhasil, backend kamu akan:
- ✅ Running 24/7 di Railway
- ✅ Connect ke 2 MongoDB databases
- ✅ Bisa diakses dari web & mobile
- ✅ Auto-deploy on git push
- ✅ Secure dengan environment variables

**Next:** Update frontend URLs untuk point ke Railway backend!

---

*Last Updated: November 3, 2026*  
*WattWise Backend - Railway Deployment*
