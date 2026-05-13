# Phase 1: Project Setup - Context

**Gathered:** 2025-05-13
**Status:** Ready for planning

## Phase Boundary

Initialize React + Vite project with routing, state management, and responsive layout. This phase delivers the foundational project structure that all subsequent phases build upon.

**In scope:**
- Vite + React + TypeScript project scaffold
- Tailwind CSS configuration with custom theme
- React Router v6 setup with basic routes
- Zustand store with persist middleware for LocalStorage
- Responsive layout component (mobile-first)
- Basic device list page with CRUD functionality
- Chinese language support
- Project structure setup (pages, components, stores, hooks)

**Out of scope:**
- Weather API integration (Phase 2)
- Irrigation recommendation engine (Phase 3)
- Data import/export (Phase 4)
- Advanced UI polish (Phase 5)

## Implementation Decisions

### Project Structure
- **D-01:** Use standard Vite React project structure with `src/` directory
- **D-02:** Organize by feature: `src/pages/`, `src/components/`, `src/stores/`, `src/hooks/`, `src/types/`, `src/utils/`
- **D-03:** Components split into `common/` (reusable) and `business/` (domain-specific)

### State Management
- **D-04:** Use Zustand with `persist` middleware for LocalStorage sync
- **D-05:** Separate stores: `deviceStore` (device data), `weatherStore` (weather cache), `uiStore` (UI state)
- **D-06:** Device store structure: `{ devices: Device[], addDevice, updateDevice, deleteDevice, getDeviceById }`

### Styling
- **D-07:** Tailwind CSS with custom color theme (green/agriculture focused)
- **D-08:** Mobile-first responsive design with breakpoints: sm(640px), md(768px), lg(1024px)
- **D-09:** Large touch targets (min 44px) for outdoor use
- **D-10:** High contrast mode support for sunlight visibility

### Routing
- **D-11:** React Router v6 with routes: `/` (home/device list), `/device/:id` (device detail), `/add` (add device), `/settings` (settings)
- **D-12:** Bottom navigation bar on mobile, sidebar on desktop

### Device Data Model
- **D-13:** Device fields: id, name, location (lat/lng), cropType, soilType, area, soilMoisture, moistureThreshold, lastIrrigationDate, createdAt
- **D-14:** Crop types: 水稻, 小麦, 玉米, 大豆, 棉花, 蔬菜 (expandable)
- **D-15:** Soil types: 砂土, 壤土, 粘土 (with different water retention characteristics)

### Language
- **D-16:** Chinese UI labels, English code comments and variable names
- **D-17:** No i18n framework for v1 (single language)

### Development Setup
- **D-18:** TypeScript strict mode enabled
- **D-19:** ESLint + Prettier for code quality
- **D-20:** `npm run dev` for development, `npm run build` for production

## Canonical References

### Project Documents
- `.planning/PROJECT.md` — Project vision and core value
- `.planning/REQUIREMENTS.md` — v1 requirements (25 total)
- `.planning/ROADMAP.md` — Phase structure and success criteria
- `.planning/STATE.md` — Current project state

### Research
- `.planning/research/STACK.md` — Tech stack recommendations
- `.planning/research/WEATHER_API.md` — Open-Meteo API details
- `.planning/research/IRRIGATION_LOGIC.md` — Decision algorithms
- `.planning/research/PITFALLS.md` — Common pitfalls to avoid

## Existing Code Insights

### Reusable Assets
- No existing code — greenfield project
- Reference project in `ref/ecoisinfo-mini-program-irrigation/` for domain knowledge only

### Established Patterns
- None yet — establishing patterns in this phase

### Integration Points
- LocalStorage API for data persistence
- Open-Meteo API (prepared for Phase 2)

## Specific Ideas

- Use a card-based layout for device list (similar to reference mini-program)
- Color-code irrigation recommendations: green (SKIP), yellow (DELAY), red (WATER), blue (MONITOR)
- Include a simple onboarding flow for first-time users
- Add a "demo mode" with sample data so users can see the app working immediately

## Deferred Ideas

- PWA support (offline mode) — Phase 5 or v2
- Dark mode — Phase 5 or v2
- Multi-language support — v2
- Real-time sensor integration — v2 (hardware dependent)

---

*Phase: 1-Project Setup*
*Context gathered: 2025-05-13*
