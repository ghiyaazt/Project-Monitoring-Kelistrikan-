# 🔌 WattWise - Sistem Monitoring Kelistrikan Berbasis IoT

> **Smart Energy Monitoring System** untuk Monitoring Konsumsi Listrik Real-time dengan ESP32 & PZEM-004T

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-Private-red.svg)]()

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development Guide](#-development-guide)
- [Build & Deploy](#-build--deploy)
- [Hardware Setup](#-hardware-setup-esp32--pzem-004t)
- [API Integration](#-api-integration)
- [TODO & Roadmap](#-todo--roadmap)
- [Contributing](#-contributing)

---

## 🎯 Overview

**WattWise** adalah aplikasi web monitoring konsumsi listrik real-time untuk manajemen kos-kosan. Sistem ini memungkinkan pemilik kos untuk:

- 📊 Monitoring daya, tegangan, dan arus listrik per kamar
- 💰 Tracking pembayaran listrik penghuni
- 📈 Analisis konsumsi dan estimasi biaya
- 🔔 Notifikasi anomali penggunaan listrik
- 🏠 Manajemen multi-kos dan multi-kamar

### Key Features:

✅ **Real-time Monitoring** - Live data dari sensor PZEM-004T  
✅ **Multi-Device Support** - Kelola banyak ESP32 devices  
✅ **Payment Tracking** - Catat pembayaran listrik penghuni  
✅ **Smart Grouping** - Group devices (WattWise)  
✅ **Dark Mode** - Full dark/light theme support  
✅ **Responsive Design** - Desktop, tablet, mobile ready

---

## 🚀 Features

### 1. Dashboard Real-time
- Monitoring konsumsi daya (Watt), tegangan (Volt), arus (Ampere)
- Grafik tren penggunaan listrik (harian/mingguan)
- Statistik total energi dan estimasi biaya
- Notifikasi anomali lonjakan/penurunan daya

### 2. Manajemen Kos & Kamar
- CRUD kos (Create, Read, Update, Delete)
- CRUD kamar per kos
- Upload foto kos & kamar
- Kelola fasilitas kamar
- Status ketersediaan kamar

### 3. Manajemen Penghuni
- Data penghuni lengkap (nama, email, telepon)
- Tanggal masuk & status penghuni
- Riwayat pembayaran per penghuni
- Status pembayaran (Lunas, Belum Bayar, Terlambat)

### 4. Monitoring Perangkat IoT (WattWise Tab)
- Tambah/hapus perangkat WattWise per kamar
- Monitoring agregat grup perangkat
- Chart konsumsi multi-device
- Legend warna per device
- Real-time data tegangan, arus, daya

### 5. Laporan Keuangan
- Rekap pembayaran per periode
- Filter berdasarkan status
- Export data (planned)

### 6. Profil & Pengaturan
- Manajemen profil user
- Dark/Light mode toggle
- Notifikasi preferences

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Recharts** - Data visualization
- **CSS Variables** - Theming system
- **Context API** - State management
- **localStorage** - Data persistence

### Build Tools
- **Create React App** - Project setup
- **PostCSS + Autoprefixer** - CSS processing
- **TypeScript Compiler** - Type checking

### Hardware (IoT)
- **ESP32** - Mikrokontroler
- **PZEM-004T** - AC power sensor
- **MQTT/WebSocket** - Communication protocol (planned)

### Planned Backend
- **Node.js + Express** - REST API
- **MongoDB** - Database
- **MQTT Broker** - Real-time communication

---

## 📁 Project Structure

```
wattwise/
├── public/                      # Static assets
│   ├── assets/logos/           # Logo files
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── app/                    # Application setup
│   │   ├── App.tsx            # Main app component
│   │   ├── router.tsx         # Route definitions (planned)
│   │   └── providers.tsx      # Context providers (planned)
│   │
│   ├── features/              # Feature-based modules
│   │   └── auth/             # Authentication feature
│   │       ├── components/   # Login, Register, ForgotPassword
│   │       └── index.ts      # Public API
│   │
│   ├── components/            # Reusable UI components
│   │   ├── layout/           # Sidebar, Logo, Navigation
│   │   ├── landing/          # Landing page components
│   │   │   ├── landingPage/  # AboutSection, HomeSection
│   │   │   └── daftarKos/    # SearchBar, KosCard
│   │   └── dashboard/        # Dashboard components
│   │       ├── kamar/        # Kamar-related components
│   │       │   ├── kamarList/     # KamarCard, KosHeader
│   │       │   └── detailKamar/   # DetailTab, PaymentTab, WattwiseTab
│   │       └── profile/      # ProfileCard, SecuritySection
│   │
│   ├── pages/                # Page components (composers)
│   │   ├── Landing/         # LandingPage, DaftarKos
│   │   └── Dashboard/       # Dashboard, Profil, Pengaturan
│   │       └── Kamar/       # KamarList, DetailKamar, Penghuni
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── context/         # Context management hooks
│   │   │   ├── useUserManagement.ts
│   │   │   ├── useDeviceManagement.ts
│   │   │   ├── useKosManagement.ts
│   │   │   ├── usePerangkatManagement.ts
│   │   │   └── useThemeManagement.ts
│   │   └── dashboard/kamar/
│   │       ├── detailKamar/WattwiseTab/
│   │       └── kamarList/useKamarListHandlers.ts
│   │
│   ├── utils/                # Utility functions
│   │   ├── auth/            # emailUtils
│   │   └── dashboard/kamar/
│   │       ├── detailKamar/
│   │       │   ├── kamarUtils.ts        # getKamarAndKos
│   │       │   ├── PaymentTab/          # paymentUtils
│   │       │   └── WattwiseTab/         # wattwiseUtils, wattwiseConstants
│   │       ├── kamarList/
│   │       │   └── kamarListUtils.ts    # getTotalKamarTerisi
│   │       └── penghuni/
│   │           └── penghuniUtils.ts     # getStatusBadgeClass, getStatusText
│   │
│   ├── types/                # TypeScript type definitions
│   │   └── dashboard/kamar/ # Interface definitions
│   │
│   ├── constants/            # Application constants
│   │   └── navigation.ts    # Navigation config, Page types
│   │
│   ├── context/              # React Context
│   │   ├── AppContext.tsx   # Main context provider
│   │   ├── types.ts         # TypeScript types
│   │   └── storage.ts       # localStorage utilities
│   │
│   ├── data/                 # Mock data
│   │   └── mockData.ts
│   │
│   ├── styles/               # CSS files (feature-based, consistent structure)
│   │   ├── index.css        # 🎯 MAIN ENTRY: CSS Variables + Tailwind + Feature imports
│   │   ├── auth/            # Auth pages (index.css → auth.css + auth-dark.css)
│   │   ├── common/          # Shared UI (index.css → app, buttons, cards, badges, etc.)
│   │   ├── dashboard/       # Dashboard (index.css → dashboard.css + dashboard-dark.css)
│   │   ├── daftarkos/       # Daftar kos (index.css → daftarkos.css + daftarkos-dark.css)
│   │   ├── kamar/           # Kamar management (index.css → all kamar components)
│   │   │   ├── index.css
│   │   │   ├── kamar-card.css
│   │   │   ├── kamar-list.css
│   │   │   ├── penghuni.css
│   │   │   └── wattwise-tab.css
│   │   ├── landing/         # Landing page (index.css → landing-page.css)
│   │   ├── profil/          # Profile page (index.css → profil.css)
│   │   ├── settings/        # Settings page (index.css → settings.css + settings-dark.css)
│   │   └── sidebar/         # Sidebar component (index.css → sidebar.css)
│   │
│   ├── index.tsx             # Application entry point
│   └── index.css             # Global styles
│
├── .env.example              # Environment variables template
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

### Architecture Principles

1. **Feature-Based Organization** - Code organized by business feature
2. **Component Reusability** - Shared components in `components/`
3. **Separation of Concerns** - UI, logic, data separated
4. **Type Safety** - TypeScript interfaces for all data structures
5. **CSS Architecture** - Feature-based CSS with CSS Variables
   - Every feature folder has `index.css` as entry point
   - Consistent structure across all styles folders
   - Single main entry: `src/styles/index.css`
   - CSS Variables for theming (`--color-*`, `--spacing-*`, etc.)
   - Dark mode support with separate `-dark.css` files

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** 14.x atau lebih baru
- **npm** atau **yarn**
- **Git**

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd wattwise

# 2. Install dependencies
npm install

# 3. Setup environment variables (optional)
cp .env.example .env

# 4. Start development server
npm start
```

Aplikasi akan berjalan di **http://localhost:3000**

### Default Login

```
Email: demo@wattwise.com
Password: (any password)
```

> **Note:** Authentication saat ini untuk demo only. Backend integration coming soon.

---

## 💻 Development Guide

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests (if configured)
npm test

# Eject from CRA (not recommended)
npm run eject

# 🔧 Development Utilities (Cache Management)
npm run fix          # Quick fix - Clear cache & restart dev server
npm run clear-cache  # Clear all development caches (detailed output)
npm run clean-start  # Full clean - Clear cache + restart server (verbose)
```

### Development Utilities

Project ini dilengkapi dengan PowerShell scripts untuk mengatasi common development issues:

**Problem:** "Uncaught ReferenceError" atau HMR (Hot Module Replacement) errors
**Solution:** Run cache clearing scripts

```bash
# Quick fix (recommended for most issues)
npm run fix

# If problem persists, try full clean
npm run clean-start
```

**What these scripts do:**
- Clear webpack cache (`node_modules/.cache/`)
- Clear build folder (`build/`)
- Clear ESLint cache (`.eslintcache`)
- Kill processes on port 3000
- Restart development server

**When to use:**
- After major refactoring
- When seeing stale code in browser
- After renaming variables/functions
- When HMR throws errors
- After switching branches

> 💡 **Tip:** Always hard refresh browser (Ctrl+Shift+R) after running fix scripts

For more details, see `scripts/README.md`

### Code Style

- **TypeScript** untuk type safety
- **Functional Components** dengan hooks
- **CSS Modules** + **CSS Variables** untuk styling
- **Feature-based folder structure**

### Import Patterns

```typescript
// ✅ Components
import { KamarCard } from '../../../components/dashboard/kamar/kamarList';

// ✅ Utils
import { generateHourlyDataForDevices } from '../../../utils/dashboard/kamar/detailKamar/WattwiseTab';
import { getKamarAndKos } from '../../../utils/dashboard/kamar/detailKamar';
import { getTotalKamarTerisi } from '../../../utils/dashboard/kamar/kamarList';
import { getStatusBadgeClass, getStatusText } from '../../../utils/dashboard/kamar/penghuni';

// ✅ Constants
import { NAVIGATION_ITEMS, type Page } from '../../../constants/navigation';

// ✅ Context
import { useApp } from '../../../context/AppContext';

// ✅ Types
import type { Kamar, Kos } from '../../../types/dashboard/kamar';
```

### Refactoring Guidelines

Project ini telah melalui refactoring komprehensif untuk meningkatkan maintainability:

**✅ Completed Refactoring:**
1. **Inline Styles → CSS Files** (80+ styles extracted)
   - All `style={{...}}` moved to feature-based CSS files
   - CSS classes with proper naming conventions
   
2. **Business Logic → Utils** (8 functions extracted)
   - `getKamarAndKos()` - Find kamar and parent kos
   - `getTotalKamarTerisi()` - Count occupied rooms
   - `getStatusBadgeClass()` - Payment status styling
   - `getStatusText()` - Payment status text
   - `generateHourlyDataForDevices()` - Mock data generation
   - Payment calculation utilities
   
3. **Constants Extraction**
   - Navigation config (`NAVIGATION_ITEMS`, `Page` type)
   - Device colors (`DEVICE_COLORS`)
   - Mock data constants (`WEEKLY_MOCK_DATA`)
   
4. **Assets Migration**
   - Logo files moved from `public/` to `src/assets/`
   - ES6 imports for better webpack optimization
   
5. **Documentation Consolidation**
   - All docs merged into single comprehensive README.md

**Best Practices:**
- ❌ Don't put business logic in components
- ❌ Don't use inline styles (`style={{...}}`)
- ❌ Don't hardcode navigation configs in components
- ✅ Extract reusable functions to `utils/`
- ✅ Extract constants to `constants/`
- ✅ Use CSS classes from `styles/` folder
- ✅ Import assets from `src/assets/` with ES6

### State Management

Aplikasi menggunakan **Context API** dengan **localStorage** persistence:

```typescript
import { useApp } from './context/AppContext';

function MyComponent() {
  const { 
    kosList,         // List of all kos
    currentUser,     // Logged in user
    addKos,          // Add new kos
    updateKos,       // Update existing kos
    removeKos        // Delete kos
  } = useApp();
}
```

### CSS Organization

Proyek menggunakan **feature-based CSS architecture** dengan struktur konsisten:

**Structure Pattern:**
```
styles/feature/
├── index.css       # Entry point (imports all CSS files)
├── feature.css     # Main styles
└── feature-dark.css # Dark theme (optional)
```

**Main Entry Point:** `src/styles/index.css`
- CSS Variables (`:root`)
- Tailwind CSS directives (`@tailwind base/components/utilities`)
- Feature folder imports

**How to Import:**
```typescript
// ❌ Don't import individual CSS files
import '../styles/auth/auth.css';

// ✅ Import only from main entry point (already done in src/index.tsx)
import './styles/index.css';
```

**CSS Variables Usage:**
```css
.my-button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
}
```

**All folders have consistent structure:** ✅ auth, common, dashboard, daftarkos, kamar, landing, profil, settings, sidebar

**Storage Keys:**
- `wattwise_user` - User authentication data
- `wattwise_kos` - List of kos & kamar data
- `wattwise_perangkat` - IoT devices (WattWise)
- `wattwise_theme` - Theme preference

### CSS Architecture

**CSS Variables** untuk consistent theming:

```css
/* src/styles/index.css */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  
  /* Transitions */
  --transition-normal: 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Dark Mode Support:**
```css
.dark {
  --color-bg: #0f172a;
  --color-text: #f1f5f9;
  /* ... */
}
```

### Adding New Features

1. **Create folder structure**
   ```
   src/components/dashboard/newFeature/
   src/pages/Dashboard/NewFeature.tsx
   src/styles/newFeature/
   ```

2. **Add types** (if needed)
   ```typescript
   // src/types/dashboard/newFeature.ts
   export interface NewFeatureData {
     id: string;
     // ...
   }
   ```

3. **Create components**
   ```typescript
   // src/components/dashboard/newFeature/NewFeatureCard.tsx
   import './styles.css';
   
   export const NewFeatureCard = () => {
     // component logic
   };
   ```

4. **Add to navigation** (if needed)
   ```typescript
   // src/constants/navigation.ts
   export type Page = "dashboard" | ... | "new-feature";
   ```

---

## 🏗 Build & Deploy

### Production Build

```bash
npm run build
```

Output: `build/` folder

**Build Stats (Latest):**
- JavaScript: 220.57 kB (gzipped)
- CSS: 22.43 kB (gzipped)
- Total: 242.99 kB

### Deploy to Hosting

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**GitHub Pages:**
```bash
npm install --save-dev gh-pages

# Add to package.json:
"homepage": "https://username.github.io/wattwise",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

npm run deploy
```

---

## 🔌 Hardware Setup (ESP32 + PZEM-004T)

### Components Required

- **ESP32 Development Board**
- **PZEM-004T** (AC current, voltage, power sensor)
- Jumper wires
- 5V Power supply
- AC load to monitor

### Wiring Diagram

```
PZEM-004T → ESP32
─────────────────
TX        → RX (GPIO 16)
RX        → TX (GPIO 17)
VCC       → 5V
GND       → GND
```

### ESP32 Firmware

**Libraries needed:**
- `PZEM004Tv30` - For PZEM-004T communication
- `WiFi` - For network connectivity
- `HTTPClient` or `PubSubClient` - For data transmission

**Sample Code:**
```cpp
#include <PZEM004Tv30.h>
#include <WiFi.h>
#include <HTTPClient.h>

PZEM004Tv30 pzem(Serial2, 16, 17); // RX, TX

void setup() {
  Serial.begin(115200);
  WiFi.begin("SSID", "PASSWORD");
  // ... WiFi connection
}

void loop() {
  float voltage = pzem.voltage();
  float current = pzem.current();
  float power = pzem.power();
  float energy = pzem.energy();
  
  // Send data to backend
  sendData(voltage, current, power, energy);
  
  delay(5000); // Update every 5 seconds
}
```

### Data Format

```json
{
  "deviceId": "ESP32-FC24-0041",
  "timestamp": "2026-10-04T15:30:00Z",
  "voltage": 220.5,
  "current": 2.21,
  "power": 486,
  "energy": 4.02,
  "frequency": 50.1,
  "powerFactor": 0.98
}
```

---

## 🔗 API Integration

### Backend Endpoints (Planned)

```
POST   /api/auth/login              # User authentication
POST   /api/auth/register           # User registration

GET    /api/kos                     # Get all kos
POST   /api/kos                     # Create new kos
PUT    /api/kos/:id                 # Update kos
DELETE /api/kos/:id                 # Delete kos

GET    /api/kos/:kosId/kamar        # Get rooms in kos
POST   /api/kos/:kosId/kamar        # Add room
PUT    /api/kamar/:id               # Update room
DELETE /api/kamar/:id               # Delete room

POST   /api/sensor-data             # Receive data from ESP32
GET    /api/sensor-data/:deviceId   # Get device history
GET    /api/sensor-data/:deviceId/latest  # Latest reading

POST   /api/payments                # Record payment
GET    /api/payments?kamarId=...    # Get payments
PUT    /api/payments/:id            # Update payment status

GET    /api/anomalies               # Get anomaly alerts
POST   /api/anomalies               # Report anomaly
```

### Environment Variables

Create `.env` file:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8080
REACT_APP_MQTT_BROKER=mqtt://localhost:1883

# Feature Flags
REACT_APP_ENABLE_MQTT=false
REACT_APP_MOCK_DATA=true
```

---

## 📝 TODO & Roadmap

### ✅ Completed

- [x] **Code Quality & Architecture** (December 2024)
  - [x] Extract 80+ inline styles to CSS files
  - [x] Extract helper functions to utils/
    - [x] `getKamarAndKos()` from DetailKamar.tsx
    - [x] `getTotalKamarTerisi()` from KamarList.tsx
    - [x] `getStatusBadgeClass()` from Penghuni.tsx
    - [x] `getStatusText()` from Penghuni.tsx
  - [x] Move business logic to utils/ and constants/
  - [x] Consolidate 12 documentation files into README.md
  - [x] Migrate logo assets from public/ to src/assets/
  - [x] Create PowerShell utility scripts for cache management
  - [x] Reorganize styles folder for consistency
    - [x] Move app.css to common/ folder
    - [x] Add index.css to all feature folders (landing, profil)
    - [x] Standardize CSS import patterns

### 🔴 High Priority

- [ ] **Backend Integration**
  - [ ] Setup Node.js + Express server
  - [ ] Connect to MongoDB
  - [ ] Implement REST API endpoints
  - [ ] JWT authentication

- [ ] **Real-time Communication**
  - [ ] Setup MQTT broker
  - [ ] Implement WebSocket for live updates
  - [ ] ESP32 → Backend communication

### 🟡 Medium Priority

- [ ] **Features**
  - [ ] Export data ke CSV/Excel
  - [ ] Print reports
  - [ ] Email notifications
  - [ ] SMS alerts (Twilio)

- [ ] **UI/UX Improvements**
  - [ ] Loading states
  - [ ] Error boundaries
  - [ ] Toast notifications
  - [ ] Skeleton screens

- [ ] **Testing**
  - [ ] Unit tests (Jest)
  - [ ] Integration tests
  - [ ] E2E tests (Cypress)

### 🟢 Low Priority

- [ ] **Advanced Features**
  - [ ] Energy consumption predictions (ML)
  - [ ] Cost optimization suggestions
  - [ ] Multi-tenant support
  - [ ] Role-based access control

- [ ] **Performance**
  - [ ] Code splitting
  - [ ] Lazy loading
  - [ ] Image optimization
  - [ ] PWA support

---

## 🐛 Known Issues

1. **Mock Data** - Currently using mock data. Backend integration in progress.
2. **Real-time Updates** - Simulated with setTimeout. Need WebSocket/MQTT.
3. **Authentication** - No backend validation. Demo purposes only.
4. **File Upload** - Images stored in base64 (localStorage). Need cloud storage.
5. **Anomaly Detection** - Simple threshold (>50% change). Need better algorithm.

---

## 🤝 Contributing

### Code Quality Guidelines

1. **Components should only contain UI logic**
   - No business logic in components
   - Extract calculations to utils/
   - Extract data transformations to utils/

2. **Utils folder structure**
   ```
   src/utils/dashboard/kamar/
   ├── statusUtils.ts      # Status formatting
   ├── kamarUtils.ts       # Kamar calculations
   └── index.ts            # Exports
   ```

3. **CSS organization**
   - One CSS file per component/feature
   - Use CSS Variables for theming
   - BEM naming convention (optional)

4. **Type safety**
   - Define interfaces in `src/types/`
   - Use TypeScript strict mode
   - No `any` types

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug in component
docs: update README
style: format code
refactor: refactor component
test: add tests
chore: update dependencies
```

---

## 📄 License

Private project untuk monitoring listrik kos-kosan.

---

## 👥 Team

**Developer:** [Your Name]  
**Contact:** [Your Email]  
**Version:** 0.1.0  
**Last Updated:** October 4, 2026

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [PZEM-004T Datasheet](https://www.peacefair.com/)

---

**Made with ❤️ for Smart Energy Monitoring**
