# Research Summary

> Synthesized from parallel research on weather APIs, irrigation logic, tech stack, and pitfalls.

## Key Findings

### Weather API: Open-Meteo
- **No API key required** — zero friction for development
- **10,000 calls/day** free tier
- **Hourly precipitation + probability** up to 16 days
- **CORS-friendly** for direct browser use
- **China coverage** via CMA GRAPES Global model
- Fallback: QWeather (和风天气) for minute-level China forecasts

### Irrigation Logic
- **Simple rule-based approach** for v1: rain overrides, ET thresholds
- **Key factors**: rainfall (>5mm forecast = delay), temperature (<5°C = skip), humidity (>85% = reduce)
- **ET calculation**: Hargreaves method (simplified, temperature-only) sufficient for v1
- **Device data model**: crop type, soil type, location, thresholds, last irrigation date

### Tech Stack
- **React 18 + Vite + TypeScript + Tailwind CSS**
- **State management**: Zustand with persist middleware (simpler than Redux, auto-syncs to LocalStorage)
- **Routing**: React Router v6
- **Icons**: lucide-react
- **Dates**: date-fns
- **HTTP**: native fetch (simple enough, no axios needed)

### Pitfalls to Watch
1. **Weather as ground truth** — always show data freshness, allow user corrections
2. **LocalStorage limits** — ~5MB cap, implement data export/backup
3. **API downtime** — cache weather data, show stale-while-revalidate
4. **Mobile UX** — design for outdoor use (sunlight visibility, large touch targets)
5. **No offline fallback** — cache last weather data, show "last known" status

## Recommendations

1. **Start simple** — rule-based irrigation advice, not full ET modeling
2. **Cache aggressively** — weather data TTL: 1 hour for forecasts, 15 min for current
3. **Export early** — let users backup their device data (JSON export)
4. **Test on mobile** — primary use case is field workers on phones
5. **Graceful degradation** — if weather API fails, show device status + manual override

## Files

- `.planning/research/WEATHER_API.md` — Full API comparison
- `.planning/research/IRRIGATION_LOGIC.md` — Decision algorithms and data models
- `.planning/research/STACK.md` — Project structure and library choices
- `.planning/research/PITFALLS.md` — 15 actionable pitfalls with prevention strategies
