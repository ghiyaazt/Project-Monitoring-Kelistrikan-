# Struktur Mobile App - WattWise

## 📁 Struktur Folder yang Sudah Dibuat

```
mobile/
├── src/
│   ├── screens/              # 13 screens dari tampilan mobile (React Web)
│   │   ├── MobileLogin.tsx
│   │   ├── MobileDashboard.tsx
│   │   ├── MobileMonitoring.tsx
│   │   ├── MobileElectricity.tsx
│   │   ├── MobileTitikListrik.tsx
│   │   ├── MobileAnomali.tsx
│   │   ├── MobileNotifikasi.tsx
│   │   ├── MobileRiwayat.tsx
│   │   ├── MobilePayments.tsx
│   │   ├── MobileTenants.tsx
│   │   ├── MobileProfile.tsx
│   │   ├── MobilePengaturan.tsx
│   │   ├── MobileApp.tsx
│   │   └── index.ts          # Export file
│   │
│   ├── components/           # Reusable components (sudah ada contoh)
│   │   ├── Button.tsx        # ✅ Custom button component
│   │   ├── Card.tsx          # ✅ Card container
│   │   └── index.ts
│   │
│   ├── data/                 # Mock data
│   │   ├── mockData.ts       # ✅ Data sensor, devices, dll
│   │   └── index.ts
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useIsMobile.ts    # Hook untuk detect mobile
│   │   └── index.ts
│   │
│   ├── types/                # TypeScript types
│   │   └── index.ts          # ✅ Interfaces untuk Device, Sensor, dll
│   │
│   └── constants/            # Constants
│       ├── colors.ts         # ✅ Color palette WattWise
│       └── index.ts
│
├── App.tsx                   # ✅ Main app entry (sementara)
├── package.json              # ✅ Updated scripts dengan npx
└── README.md                 # ✅ Dokumentasi lengkap
```

## ✅ Yang Sudah Selesai

1. **Folder Structure**
   - ✅ Buat folder `src/` dengan subfolder
   - ✅ Copy semua 13 screens dari `/tampilan wattwise/mobile/`
   - ✅ Copy data mock (`mockData.ts`)
   - ✅ Copy hooks (`useIsMobile.ts`)

2. **Setup Files**
   - ✅ App.tsx dengan basic React Native setup
   - ✅ Index exports untuk screens, components, data, hooks
   - ✅ TypeScript types/interfaces
   - ✅ Color constants

3. **Example Components**
   - ✅ Button component (contoh konversi ke React Native)
   - ✅ Card component

4. **Documentation**
   - ✅ README.md lengkap
   - ✅ STRUKTUR_MOBILE.md (file ini)

5. **Package.json**
   - ✅ Fix scripts menggunakan `npx react-native`

## ⚠️ Yang Perlu Dilakukan Selanjutnya

### 1. Convert Screens ke React Native

Semua screens di `src/screens/` masih menggunakan React Web syntax:

**Perlu diganti:**
```tsx
// ❌ React Web
<div className="flex flex-col">
  <button onClick={handleClick}>
    Click me
  </button>
</div>

// ✅ React Native
<View style={styles.container}>
  <TouchableOpacity onPress={handleClick}>
    <Text>Click me</Text>
  </TouchableOpacity>
</View>
```

**Element mapping:**
- `<div>` → `<View>`
- `<span>`, `<p>`, `<h1>` → `<Text>`
- `<button>` → `<TouchableOpacity>` + `<Text>`
- `<input>` → `<TextInput>`
- `<img>` → `<Image>`
- `className` → `style={styles.xxx}`
- `onClick` → `onPress`
- `onChange` → `onChangeText`

### 2. Setup Navigation

Install dependencies:
```bash
npm install @react-navigation/native
npm install @react-navigation/stack
npm install @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
```

Buat navigation structure:
```
src/
├── navigation/
│   ├── AppNavigator.tsx      # Main stack navigator
│   ├── AuthNavigator.tsx     # Auth screens
│   └── MainNavigator.tsx     # Bottom tabs
```

### 3. Setup State Management

Pilihan:
- **Context API** (built-in, simple)
- **Zustand** (lightweight, recommended)
- **Redux Toolkit** (complex apps)

```bash
# Jika pakai Zustand
npm install zustand
```

### 4. API Integration

Buat service layer:
```
src/
├── services/
│   ├── api.ts            # Axios setup
│   ├── sensorService.ts  # API calls untuk sensor
│   └── authService.ts    # API calls untuk auth
```

Install dependencies:
```bash
npm install axios
```

### 5. Real-time Updates

Untuk monitoring real-time:
```bash
npm install socket.io-client
# atau
npm install mqtt
```

### 6. UI Library (Optional)

Pilihan:
- **React Native Paper** (Material Design)
- **Native Base** (Customizable)
- **React Native Elements**

```bash
npm install react-native-paper
npm install react-native-vector-icons
```

### 7. Additional Features

```bash
# Charts untuk grafik konsumsi
npm install react-native-chart-kit
npm install react-native-svg

# Date picker
npm install @react-native-community/datetimepicker

# AsyncStorage untuk local storage
npm install @react-native-async-storage/async-storage

# Toast/Snackbar notifications
npm install react-native-toast-message
```

## 🚀 Quick Start

### Run Development
```bash
# Terminal 1: Start Metro
npm start

# Terminal 2: Run Android
npm run android

# Terminal 3: Run backend (di folder backend/)
npm start
```

## 🔗 Integrasi Backend

Backend API endpoint: `http://localhost:3000`

**⚠️ Untuk testing di device fisik:**
- Ganti `localhost` dengan IP komputer
- Contoh: `http://192.168.1.100:3000`

**Endpoints yang tersedia:**
- `GET /api/sensor/latest` - Data sensor terbaru
- `GET /api/sensor/history?hours=24` - History data
- `GET /api/sensor/stats` - Statistik

## 📝 Catatan Penting

1. **Screens belum dikonversi** - Masih pakai React Web syntax
2. **Navigation belum setup** - Perlu install dan konfigurasi
3. **API belum terkoneksi** - Perlu setup axios/fetch
4. **Styling belum lengkap** - Perlu convert dari Tailwind ke StyleSheet
5. **Icons** - Perlu setup react-native-vector-icons atau expo icons

## 🎯 Priority Tasks

1. **High Priority:**
   - [ ] Setup navigation
   - [ ] Convert MobileLogin.tsx ke React Native
   - [ ] Setup API service layer
   - [ ] Test koneksi ke backend

2. **Medium Priority:**
   - [ ] Convert remaining screens
   - [ ] Implement authentication flow
   - [ ] Setup real-time updates

3. **Low Priority:**
   - [ ] Add animations
   - [ ] Optimize performance
   - [ ] Add offline support

## 📚 Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
