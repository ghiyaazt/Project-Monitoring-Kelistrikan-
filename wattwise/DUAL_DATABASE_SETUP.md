# 🗄️ Dual Database Setup - WattWise

Dokumentasi setup 2 database untuk memisahkan IoT data dan Web/Mobile data.

---

## 🎯 Goal

Memisahkan data IoT dan data aplikasi ke database berbeda:

- **Database `test`** → IoT sensor data (MQTT readings)
- **Database `wattwise`** → Web & Mobile data (users, auth, kos, rooms)

---

## 📊 Database Architecture

```
MongoDB Atlas Cluster: cluster0.mcteeff.mongodb.net
│
├─ Database: test
│  ├─ Collection: sensor_data
│  │  ├─ device_id
│  │  ├─ voltage
│  │  ├─ current
│  │  ├─ power
│  │  ├─ energy
│  │  ├─ frequency
│  │  ├─ powerfactor
│  │  └─ timestamp
│  │
│  └─ Purpose: IoT sensor readings dari ESP32/PZEM
│
└─ Database: wattwise
   ├─ Collection: users
   │  ├─ nama
   │  ├─ email
   │  ├─ password (hashed)
   │  ├─ no_telp
   │  └─ role (owner/penghuni/admin)
   │
   ├─ Collection: kos
   │  ├─ namaKos
   │  ├─ alamat
   │  ├─ owner_id
   │  └─ deskripsi
   │
   ├─ Collection: rooms (kamar)
   │  ├─ kos_id
   │  ├─ nomorKamar
   │  ├─ hargaSewa
   │  └─ status
   │
   ├─ Collection: penghuni
   │  ├─ nama
   │  ├─ kamar_id
   │  └─ tanggalMasuk
   │
   └─ Collection: devices
      ├─ device_id
      ├─ kamar_id
      └─ status
```

---

## 🔗 Connection Strings

### IoT Database (test)
```
mongodb+srv://redgmaing66_db_user:IwS9zLMfTtMz8p5m@cluster0.mcteeff.mongodb.net/test?retryWrites=true&w=majority
```

**Used by:**
- MQTT Service (save sensor data)
- Sensor Controller (read sensor data)
- IoT Dashboard (display real-time data)

### Main Database (wattwise)
```
mongodb+srv://redgmaing66_db_user:IwS9zLMfTtMz8p5m@cluster0.mcteeff.mongodb.net/wattwise?retryWrites=true&w=majority
```

**Used by:**
- Auth Service (login, register)
- User Management
- Kos Management
- Room Management
- Finance Reports

---

## 🛠️ Implementation

### Backend Configuration

**File: `backend/.env`**

```env
# Main database - Web & Mobile data
MONGODB_URI=mongodb+srv://...wattwise?retryWrites=true&w=majority

# IoT database - Sensor data only
MONGODB_IOT_URI=mongodb+srv://...test?retryWrites=true&w=majority
```

**File: `backend/src/config/database.js`**

```javascript
// Two connections
const mainConnection = mongoose.connect(MONGODB_URI);      // wattwise
const iotConnection = mongoose.createConnection(MONGODB_IOT_URI);  // test

// Export both
module.exports = {
  connectDatabase,
  getMainConnection,
  getIoTConnection
};
```

**File: `backend/src/models/SensorData.js`**

```javascript
// Use IoT connection for sensor data
const { getIoTConnection } = require('../config/database');
const iotConnection = getIoTConnection();
const SensorData = iotConnection.model('SensorData', sensorDataSchema);
```

**Other Models** (User, Kos, Room, etc):

```javascript
// Use default connection (main/wattwise)
const User = mongoose.model('User', userSchema);
```

---

## 🔄 Data Flow

### IoT Data Flow:

```
ESP32 → MQTT Broker → Backend MQTT Service → SensorData Model → IoT Connection → test database
```

### Web/Mobile Data Flow:

```
Web/Mobile → Backend API → User/Kos/Room Models → Main Connection → wattwise database
```

---

## ✅ Benefits

### 1. **Performance**
- IoT data tidak mengganggu query auth/user
- Database indexing lebih optimal
- Scaling independent

### 2. **Organization**
- Data terpisah berdasarkan purpose
- Easier to backup (backup test database saja untuk IoT)
- Clearer data ownership

### 3. **Security**
- Bisa set different access control
- IoT data bisa read-only untuk frontend
- User data lebih secure

### 4. **Scalability**
- IoT database bisa di-scale sendiri (high write)
- Main database optimize untuk read heavy
- Different sharding strategy

---

## 🧪 Testing

### Test IoT Connection:

```javascript
// Save sensor data (should go to test database)
const sensorData = new SensorData({
  device_id: 'ESP32_001',
  voltage: 220.5,
  current: 1.2,
  power: 264.6,
  energy: 5.5
});
await sensorData.save();

// Check in MongoDB: should be in 'test' database
```

### Test Main Connection:

```javascript
// Save user data (should go to wattwise database)
const user = new User({
  nama: 'Test User',
  email: 'test@example.com',
  password: 'hashed_password',
  no_telp: '08123456789',
  role: 'owner'
});
await user.save();

// Check in MongoDB: should be in 'wattwise' database
```

---

## 📝 Environment Variables

### Local Development (`.env`)

```env
MONGODB_URI=mongodb+srv://...wattwise?retryWrites=true&w=majority
MONGODB_IOT_URI=mongodb+srv://...test?retryWrites=true&w=majority
```

### Railway Production

Set di Railway Dashboard → Variables:

```env
MONGODB_URI=mongodb+srv://...wattwise?retryWrites=true&w=majority
MONGODB_IOT_URI=mongodb+srv://...test?retryWrites=true&w=majority
```

---

## 🔍 Monitoring

### Check Connections on Startup:

```
✅ Main MongoDB (wattwise) connected successfully
✅ IoT MongoDB (test) connected successfully
```

### Verify Data Location:

**MongoDB Atlas:**
1. Login to MongoDB Atlas
2. Browse Collections
3. Check `test` database → sensor_data collection
4. Check `wattwise` database → users, kos, rooms collections

---

## 🐛 Troubleshooting

### Problem: Both data masuk ke wattwise database

**Solution:**
- Check SensorData model uses `getIoTConnection()`
- Verify MONGODB_IOT_URI is set
- Restart backend after env change

### Problem: IoT connection failed

**Solution:**
- Verify MONGODB_IOT_URI format
- Check database name is `test`
- Check MongoDB Atlas network access

### Problem: Models not using correct connection

**Solution:**
- SensorData → use `iotConnection.model()`
- Other models → use `mongoose.model()` (default)

---

## 📊 Database Sizes (Expected)

### test Database (IoT):
- **Size**: Large (continuous sensor data)
- **Growth**: ~1-10MB per day depending on sampling rate
- **Retention**: Consider auto-delete old data (>30 days)

### wattwise Database (Main):
- **Size**: Small-Medium
- **Growth**: Slow (based on user registration)
- **Retention**: Keep all data (user accounts, transactions)

---

## 🔒 Security Notes

### Connection String Security:
- ✅ Use environment variables
- ✅ Never commit to Git
- ✅ Different passwords for prod/dev (optional)

### Access Control:
- ✅ MongoDB user has access to both databases
- ✅ Backend validates all writes
- ✅ Frontend never directly accesses MongoDB

---

## 📈 Future Enhancements

### 1. Read Replicas
- Add read replicas for IoT data
- Separate read/write connections

### 2. Time-Series Collections
- Use MongoDB time-series for sensor data
- Better compression and performance

### 3. Archival Strategy
- Move old IoT data to archive database
- Keep wattwise data forever

### 4. Sharding
- Shard IoT database by device_id
- Shard main database by kos_id (future)

---

## 🎯 Quick Reference

### Connection Usage:

| Model | Database | Connection |
|-------|----------|------------|
| SensorData | test | IoT Connection |
| User | wattwise | Main Connection |
| Kos | wattwise | Main Connection |
| Room | wattwise | Main Connection |
| Penghuni | wattwise | Main Connection |
| Device | wattwise | Main Connection |

### Code Patterns:

```javascript
// For IoT data
const { getIoTConnection } = require('../config/database');
const iotConn = getIoTConnection();
const Model = iotConn.model('ModelName', schema);

// For main data (default)
const Model = mongoose.model('ModelName', schema);
```

---

## ✅ Verification Steps

After setup, verify:

1. **Backend Logs:**
   ```
   ✅ Main MongoDB (wattwise) connected successfully
   ✅ IoT MongoDB (test) connected successfully
   ```

2. **MongoDB Atlas:**
   - Check `test` database has sensor_data
   - Check `wattwise` database has users, kos, rooms

3. **Test Data:**
   - Create user → should be in wattwise
   - Save sensor data → should be in test

---

**🎉 Setup Complete!**

Backend sekarang menggunakan 2 database terpisah untuk optimal performance dan organization!

---

*Last Updated: November 3, 2026*  
*WattWise Dual Database Architecture*
