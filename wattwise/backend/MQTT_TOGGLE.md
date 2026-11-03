# 🔌 MQTT Toggle Guide

Cara enable/disable MQTT di WattWise Backend.

---

## 🎯 Use Cases

### Disable MQTT (Web/Mobile Only):
- ✅ Development web/mobile tanpa hardware IoT
- ✅ Testing API authentication & CRUD
- ✅ Deploy di Railway/Heroku (save resources)
- ✅ Backend cuma handle REST API

### Enable MQTT (Full IoT Mode):
- ✅ Production dengan hardware ESP32
- ✅ Real-time sensor data monitoring
- ✅ IoT dashboard dengan live data
- ✅ Full system integration

---

## ⚙️ Cara Toggle MQTT

### Disable MQTT (Web/Mobile Only):

**File: `backend/.env`**

```env
# Set to false to disable MQTT
MQTT_ENABLED=false
```

**Restart backend:**
```bash
npm start
```

**Output:**
```
✅ Main MongoDB (wattwise) connected successfully
✅ IoT MongoDB (test) connected successfully
⚠️  MQTT is DISABLED - Running in Web/Mobile API only mode
💡 To enable MQTT, set MQTT_ENABLED=true in .env
🚀 WattWise Backend running on port 5000
🔌 MQTT Status: DISABLED
```

### Enable MQTT (Full IoT Mode):

**File: `backend/.env`**

```env
# Set to true to enable MQTT
MQTT_ENABLED=true
```

**Restart backend:**
```bash
npm start
```

**Output:**
```
✅ Main MongoDB (wattwise) connected successfully
✅ IoT MongoDB (test) connected successfully
📡 MQTT is ENABLED - Connecting to broker...
✅ Connected to MQTT broker
📡 Subscribed to topic: pzem/data
🚀 WattWise Backend running on port 5000
🔌 MQTT Status: ENABLED
```

---

## 🚀 Railway Deployment

### Web/Mobile Only (Disable MQTT):

Di Railway Dashboard → Variables:

```env
MQTT_ENABLED=false
```

Benefits:
- ✅ Hemat resources
- ✅ Faster startup
- ✅ Ga perlu MQTT broker
- ✅ Focus on REST API only

### Full IoT Mode (Enable MQTT):

```env
MQTT_ENABLED=true
MQTT_BROKER_URL=mqtt://broker.hivemq.com
MQTT_PORT=1883
MQTT_CLIENT_ID=wattwise-railway
MQTT_TOPIC_SUBSCRIBE=pzem/data
```

---

## 📊 Feature Matrix

| Feature | MQTT Disabled | MQTT Enabled |
|---------|--------------|--------------|
| Login/Register API | ✅ Works | ✅ Works |
| User Management | ✅ Works | ✅ Works |
| Kos Management | ✅ Works | ✅ Works |
| Room Management | ✅ Works | ✅ Works |
| Finance Reports | ✅ Works | ✅ Works |
| Sensor Data API | ✅ Works (read only) | ✅ Works (read/write) |
| Real-time MQTT | ❌ Disabled | ✅ Works |
| IoT Dashboard | ⚠️ Old data only | ✅ Live data |

---

## 🧪 Testing

### Test dengan MQTT Disabled:

```bash
# Start backend
npm start

# Should see:
# ⚠️  MQTT is DISABLED - Running in Web/Mobile API only mode

# Test login (should work)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test get sensor data (should work - read old data)
curl http://localhost:5000/api/sensor/latest
```

### Test dengan MQTT Enabled:

```bash
# Update .env
MQTT_ENABLED=true

# Start backend
npm start

# Should see:
# 📡 MQTT is ENABLED - Connecting to broker...
# ✅ Connected to MQTT broker

# Publish MQTT message (simulate ESP32)
# Backend will automatically save to database
```

---

## 💡 Best Practices

### Development:
```env
# Local development tanpa hardware
MQTT_ENABLED=false
```

### Production with IoT:
```env
# Full production dengan ESP32
MQTT_ENABLED=true
```

### Production Web/Mobile Only:
```env
# API server untuk web/mobile saja
MQTT_ENABLED=false
```

---

## 🔧 Troubleshooting

### MQTT ga mau connect?
Set `MQTT_ENABLED=false` untuk skip MQTT dan langsung test API.

### Resource usage tinggi di Railway?
Disable MQTT kalo ga perlu real-time IoT data.

### Development tanpa hardware?
Set `MQTT_ENABLED=false` untuk development web/mobile.

---

## 📝 Quick Commands

```bash
# Disable MQTT
echo MQTT_ENABLED=false >> .env

# Enable MQTT  
echo MQTT_ENABLED=true >> .env

# Check status
npm start | grep "MQTT Status"
```

---

**✅ Done! Sekarang lu bisa toggle MQTT sesuai kebutuhan!**

*Default: MQTT disabled untuk web/mobile development*
