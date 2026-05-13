# Plan: Phase 1 - Project Setup

**Phase:** 1 - Project Setup
**Date:** 2025-05-13
**Status:** Ready for execution

## Overview

Initialize React + Vite project with routing, state management, and responsive layout. This phase delivers the foundational project structure that all subsequent phases build upon.

## Requirements Covered

- DEV-01: Add device with name, location, crop type, area, soil moisture
- DEV-02: Edit device details
- DEV-03: Delete device
- DEV-04: View device list with status
- DAT-01: LocalStorage persistence
- DAT-02: Cross-session persistence
- UI-01: Responsive design
- UI-02: Outdoor-friendly UI
- UI-05: Chinese language support

## Plans

### Plan 1: Project Scaffold
**Wave:** 1
**Depends on:** None
**Files Modified:** 
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/index.css`
- `.eslintrc.cjs`
- `.prettierrc`
- `.gitignore`

**Tasks:**

1. **Initialize Vite project**
   - Run `npm create vite@latest . -- --template react-ts`
   - Install dependencies: `react`, `react-dom`, `typescript`
   - Install dev dependencies: `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`

2. **Configure TypeScript**
   - Strict mode enabled
   - Path aliases: `@/` pointing to `src/`
   - Target: ES2020

3. **Setup ESLint + Prettier**
   - ESLint with React hooks and TypeScript rules
   - Prettier for code formatting
   - Pre-commit hooks (optional)

### Plan 2: Tailwind CSS + Theming
**Wave:** 1
**Depends on:** Plan 1
**Files Modified:**
- `tailwind.config.js`
- `postcss.config.js`
- `src/index.css`
- `src/styles/theme.css`

**Tasks:**

1. **Install Tailwind CSS**
   - `npm install -D tailwindcss postcss autoprefixer`
   - `npx tailwindcss init -p`

2. **Configure Custom Theme**
   - Agriculture/green color palette:
     - Primary: `#2E7D32` (green-800)
     - Secondary: `#81C784` (green-300)
     - Accent: `#FF6F00` (amber-800)
     - Background: `#F5F5F5` (grey-100)
     - Surface: `#FFFFFF`
   - Mobile-first breakpoints
   - Custom spacing for touch targets (min 44px)

3. **Setup Global Styles**
   - Import Tailwind directives
   - Custom utility classes for outdoor visibility
   - Font stack (system fonts for performance)

### Plan 3: React Router + Layout
**Wave:** 2
**Depends on:** Plan 1
**Files Modified:**
- `src/App.tsx`
- `src/components/layout/AppLayout.tsx`
- `src/components/layout/Navigation.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/layout/DesktopSidebar.tsx`
- `src/pages/Home/index.tsx`
- `src/pages/DeviceDetail/index.tsx`
- `src/pages/AddDevice/index.tsx`
- `src/pages/Settings/index.tsx`

**Tasks:**

1. **Install React Router**
   - `npm install react-router-dom`
   - Setup BrowserRouter with routes:
     - `/` - Home (device list)
     - `/device/:id` - Device detail
     - `/add` - Add device
     - `/settings` - Settings

2. **Create Layout Components**
   - AppLayout: responsive wrapper
   - MobileNav: bottom navigation bar
   - DesktopSidebar: side navigation for desktop
   - Navigation items: 我的设备, 添加设备, 设置

3. **Create Page Components**
   - Home: device list page (placeholder)
   - DeviceDetail: device detail page (placeholder)
   - AddDevice: add device form (placeholder)
   - Settings: settings page (placeholder)

### Plan 4: Zustand State Management
**Wave:** 2
**Depends on:** Plan 1
**Files Modified:**
- `src/stores/deviceStore.ts`
- `src/stores/weatherStore.ts`
- `src/stores/uiStore.ts`
- `src/types/device.ts`
- `src/types/weather.ts`

**Tasks:**

1. **Install Zustand**
   - `npm install zustand`
   - Install persist middleware

2. **Define TypeScript Types**
   - Device: id, name, location, cropType, soilType, area, soilMoisture, moistureThreshold, lastIrrigationDate, createdAt
   - CropType: 水稻, 小麦, 玉米, 大豆, 棉花, 蔬菜
   - SoilType: 砂土, 壤土, 粘土
   - WeatherData: temperature, humidity, precipitation, forecast

3. **Create Device Store**
   - State: devices array
   - Actions: addDevice, updateDevice, deleteDevice, getDeviceById
   - Persist to LocalStorage
   - Demo data initialization

4. **Create Weather Store**
   - State: weatherCache (by deviceId)
   - Actions: fetchWeather, getCachedWeather
   - TTL management (1h forecast, 15min current)

5. **Create UI Store**
   - State: loading states, error messages, theme
   - Actions: setLoading, setError, clearError

### Plan 5: Device CRUD UI
**Wave:** 3
**Depends on:** Plan 3, Plan 4
**Files Modified:**
- `src/pages/Home/index.tsx`
- `src/pages/Home/components/DeviceCard.tsx`
- `src/pages/DeviceDetail/index.tsx`
- `src/pages/AddDevice/index.tsx`
- `src/components/common/FormInput.tsx`
- `src/components/common/Select.tsx`
- `src/components/common/Button.tsx`
- `src/components/common/Modal.tsx`

**Tasks:**

1. **Create Common Components**
   - FormInput: labeled input with validation
   - Select: dropdown with Chinese labels
   - Button: primary/secondary variants, large touch targets
   - Modal: confirmation dialog

2. **Device List Page (Home)**
   - Display devices in card layout
   - Show device status (soil moisture, last irrigation)
   - Add device button
   - Empty state for first-time users
   - Demo mode toggle

3. **Add Device Page**
   - Form with fields:
     - 设备名称 (text)
     - 作物类型 (select: 水稻, 小麦, 玉米, 大豆, 棉花, 蔬菜)
     - 土壤类型 (select: 砂土, 壤土, 粘土)
     - 面积 (number with unit)
     - 位置 (text or map picker placeholder)
     - 土壤湿度阈值 (number)
   - Validation and error messages
   - Submit to deviceStore

4. **Device Detail Page**
   - Display device info
   - Edit button (navigate to edit mode)
   - Delete button with confirmation
   - Show current soil moisture (manual input placeholder)
   - Placeholder for weather and recommendation (Phase 2/3)

5. **Edit Device Flow**
   - Reuse AddDevice form with pre-filled data
   - Update deviceStore on save

## Verification Criteria

- [ ] `npm run dev` starts development server without errors
- [ ] `npm run build` produces production build without errors
- [ ] App displays in browser with Chinese UI
- [ ] Navigation works between all routes
- [ ] Device CRUD operations work (add, edit, delete)
- [ ] Data persists after page refresh
- [ ] Responsive layout works on mobile and desktop
- [ ] Demo data shows on first visit
- [ ] All touch targets are minimum 44px

## Must-Haves

1. Working dev server and build
2. Responsive navigation (mobile + desktop)
3. Device CRUD with LocalStorage persistence
4. Chinese UI labels
5. Demo data for first-time users

## Notes

- Keep components simple — this is foundation only
- Placeholder content for weather/recommendation (Phase 2/3)
- Focus on mobile UX (primary use case)
- Use Lucide React for icons (install: `npm install lucide-react`)
