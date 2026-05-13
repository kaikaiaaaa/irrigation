# Roadmap: 放心灌 Web版

**Version:** v1.0
**Mode:** standard (Horizontal Layers)
**Created:** 2025-05-13
**Requirements:** 25 v1 requirements mapped

---

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Project Setup | Initialize React + Vite project with routing, state management, and responsive layout | DEV-01~05, DAT-01~02, UI-01~02, UI-05 | 5 |
| 2 | Weather Service | Integrate Open-Meteo API with caching and error handling | WTH-01~05, UI-03~04 | 4 |
| 3 | Irrigation Engine | Build rule-based recommendation engine | REC-01~05 | 4 |
| 4 | Data Management | Implement import/export and storage safeguards | DAT-03~05 | 3 |
| 5 | Polish & Release | UI refinements, testing, and deployment | UI-01~05 (refinement) | 3 |

---

## Phase Details

### Phase 1: Project Setup
**Goal:** Initialize React + Vite project with routing, state management, and responsive layout
**Mode:** standard
**Success Criteria**:
1. Vite + React + TypeScript project scaffolded and running
2. Tailwind CSS configured with custom theme
3. React Router v6 set up with routes: / (home), /device/:id, /add, /settings
4. Zustand store with persist middleware configured for LocalStorage
5. Responsive layout component (mobile-first) with navigation
6. Basic device list page with add/edit/delete functionality
7. Chinese language support

**Requirements:** DEV-01, DEV-02, DEV-03, DEV-04, DAT-01, DAT-02, UI-01, UI-02, UI-05

---

### Phase 2: Weather Service
**Goal:** Integrate Open-Meteo API with caching and error handling
**Mode:** standard
**Success Criteria**:
1. Open-Meteo API client implemented with fetch
2. Current weather data fetched and displayed per device
3. 24-hour rain forecast fetched and displayed
4. Weather data cached with TTL (1h forecast, 15min current)
5. Loading states shown during API calls
6. Error handling with user-friendly messages
7. Data freshness timestamp displayed
8. Graceful degradation when API fails

**Requirements:** WTH-01, WTH-02, WTH-03, WTH-04, WTH-05, UI-03, UI-04

---

### Phase 3: Irrigation Engine
**Goal:** Build rule-based recommendation engine
**Mode:** standard
**Success Criteria**:
1. Rule-based algorithm implemented (rain override, temperature check, humidity check)
2. Recommendation displayed per device (WATER / DELAY / SKIP / MONITOR)
3. Recommendation includes human-readable reason
4. User can manually mark device as "irrigated"
5. Last irrigation date tracked per device
6. Algorithm tested with various weather scenarios

**Requirements:** REC-01, REC-02, REC-03, REC-04, REC-05

---

### Phase 4: Data Management
**Goal:** Implement import/export and storage safeguards
**Mode:** standard
**Success Criteria**:
1. Export all device data as JSON file
2. Import device data from JSON file
3. LocalStorage quota check before save
4. Graceful handling of storage full errors
5. Data validation on import

**Requirements:** DAT-03, DAT-04, DAT-05

---

### Phase 5: Polish & Release
**Goal:** UI refinements, testing, and deployment
**Mode:** standard
**Success Criteria**:
1. Mobile UX optimized (large touch targets, high contrast)
2. Loading skeletons for all async operations
3. Error boundary for crash recovery
4. PWA manifest and service worker (optional)
5. Build optimized for production
6. Deployed to static hosting (GitHub Pages / Vercel / Netlify)

**Requirements:** UI-01~05 (refinement)

---

## Requirement Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DEV-01 | Phase 1 | Pending |
| DEV-02 | Phase 1 | Pending |
| DEV-03 | Phase 1 | Pending |
| DEV-04 | Phase 1 | Pending |
| DEV-05 | Phase 1 | Pending |
| WTH-01 | Phase 2 | Pending |
| WTH-02 | Phase 2 | Pending |
| WTH-03 | Phase 2 | Pending |
| WTH-04 | Phase 2 | Pending |
| WTH-05 | Phase 2 | Pending |
| REC-01 | Phase 3 | Pending |
| REC-02 | Phase 3 | Pending |
| REC-03 | Phase 3 | Pending |
| REC-04 | Phase 3 | Pending |
| REC-05 | Phase 3 | Pending |
| DAT-01 | Phase 1 | Pending |
| DAT-02 | Phase 1 | Pending |
| DAT-03 | Phase 4 | Pending |
| DAT-04 | Phase 4 | Pending |
| DAT-05 | Phase 4 | Pending |
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 1 | Pending |
| UI-03 | Phase 2 | Pending |
| UI-04 | Phase 2 | Pending |
| UI-05 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---

## Milestone Plan

### v1.0 Milestone
**Goal:** Working irrigation decision assistant
**Phases:** 1-5
**Target:** All v1 requirements complete

### v2.0 Milestone (Future)
**Goal:** Advanced features
**Potential additions:**
- 7-day forecast view
- ET-based calculations
- Crop growth stage tracking
- Cloud sync
- PWA offline support

---

*Roadmap created: 2025-05-13*
*Last updated: 2025-05-13*
