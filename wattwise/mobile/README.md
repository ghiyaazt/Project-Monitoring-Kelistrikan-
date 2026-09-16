# WattWise Mobile App

React Native mobile application untuk sistem monitoring kelistrikan WattWise.

## 📁 Struktur Folder

```
mobile/
├── src/
│   ├── screens/          # Screen components dari tampilan mobile
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
│   │   └── MobileApp.tsx
│   ├── components/       # Reusable components (kosong, siap diisi)
│   ├── data/            # Mock data dan types
│   │   └── mockData.ts
│   └── hooks/           # Custom hooks
│       └── useIsMobile.ts
├── android/             # Android native code
├── ios/                # iOS native code (jika ada)
├── App.tsx             # Main app entry point
└── package.json

```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.11.0
- React Native development environment
- Android Studio (untuk Android)
- Xcode (untuk iOS, Mac only)

### Installation

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios
```

## ⚠️ Status

**Screens sudah dicopy dari `/tampilan wattwise/mobile/`** tapi masih menggunakan:
- React Web syntax (className, div, dll)
- Tailwind CSS classes
- Web event handlers

### Yang Perlu Dilakukan:

1. **Convert screens ke React Native**:
   - Ganti `div` → `View`
   - Ganti `className` → `style`
   - Ganti CSS Tailwind → StyleSheet
   - Ganti event handlers web → React Native events
   
2. **Setup Navigation**:
   ```bash
   npm install @react-navigation/native
   npm install @react-navigation/stack
   npm install react-native-screens react-native-safe-area-context
   ```

3. **Setup State Management** (jika perlu):
   - Redux / Zustand / Context API

4. **Integrasi dengan Backend**:
   - Setup axios/fetch untuk API calls
   - Connect ke backend Express (localhost:3000)
   - Implement real-time updates via WebSocket/MQTT

5. **UI Components**:
   - Install React Native Paper / Native Base
   - Atau buat custom components

## 🔗 Backend Connection

Backend server: `http://localhost:3000`

Endpoints:
- `GET /api/sensor/latest` - Get latest sensor data
- `GET /api/sensor/history` - Get historical data
- `GET /api/sensor/stats` - Get statistics

## 📝 Notes

- File screens masih dalam format React Web
- Perlu konversi manual ke React Native components
- Data mock tersedia di `src/data/mockData.ts`
